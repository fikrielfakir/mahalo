<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewDeviceLoginMail;
use App\Models\User;
use App\Models\UserLoginSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:30',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'phone'    => $data['phone'] ?? null,
            'role'     => 'user',
        ]);

        try {
            $user->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            return response()->json([
                'data'    => null,
                'error'   => true,
                'message' => 'Failed to send verification email: ' . $e->getMessage(),
            ], 500);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'data' => [
                'token'          => $token,
                'token_type'     => 'Bearer',
                'email_verified' => false,
                'user'           => $this->formatUser($user),
            ],
            'error'   => false,
            'message' => 'Registration successful.',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->is_banned) {
            $reason = $user->ban_reason ? ' Reason: ' . $user->ban_reason : '';
            return response()->json([
                'data'    => null,
                'error'   => true,
                'message' => 'Your account has been suspended.' . $reason,
            ], 403);
        }

        // Device / IP tracking
        $this->trackLogin($request, $user);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'data' => [
                'token'          => $token,
                'token_type'     => 'Bearer',
                'email_verified' => ! is_null($user->email_verified_at),
                'user'           => $this->formatUser($user),
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Logged out.']);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'data'    => $this->formatUser($request->user()),
            'error'   => false,
            'message' => null,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'           => 'sometimes|string|max:100',
            'phone'          => 'nullable|string|max:30',
            'account_type'   => 'sometimes|in:individual,professional',
            'company_name'   => 'nullable|string|max:150',
            'license_number' => 'nullable|string|max:100',
        ]);

        $user->update($data);

        return response()->json([
            'data' => [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $user->phone ?? null,
                'role'           => $user->role,
                'email_verified' => ! is_null($user->email_verified_at),
                'account_type'   => $user->account_type ?? 'individual',
                'company_name'   => $user->company_name ?? null,
                'license_number' => $user->license_number ?? null,
            ],
            'error'   => false,
            'message' => 'Profile updated successfully.',
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'data'    => null,
                'error'   => false,
                'message' => 'Password reset link sent to your email.',
            ]);
        }

        return response()->json([
            'data'    => null,
            'error'   => true,
            'message' => 'We could not find a user with that email address.',
        ], 422);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'data'    => null,
                'error'   => false,
                'message' => 'Password reset successfully.',
            ]);
        }

        return response()->json([
            'data'    => null,
            'error'   => true,
            'message' => 'Invalid or expired reset token.',
        ], 422);
    }

    public function verifyEmail(Request $request, int $id, string $hash): JsonResponse
    {
        $expires   = $request->query('expires');
        $signature = $request->query('signature');

        if (! $expires || now()->timestamp > (int) $expires) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Verification link has expired.'], 410);
        }

        $expected = hash_hmac('sha256', "{$id}|{$hash}|{$expires}", config('app.key'));
        if (! hash_equals($expected, (string) $signature)) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Invalid verification link.'], 400);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'User not found.'], 404);
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Hash mismatch.'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['data' => null, 'error' => false, 'message' => 'Email already verified.']);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'data'    => null,
            'error'   => false,
            'message' => 'Email verified successfully.',
        ]);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['data' => null, 'error' => false, 'message' => 'Email already verified.']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'data'    => null,
            'error'   => false,
            'message' => 'Verification email sent.',
        ]);
    }

    // ─── Device / IP tracking ─────────────────────────────────────────────────

    private function trackLogin(Request $request, User $user): void
    {
        try {
            $ua          = $request->userAgent() ?? '';
            $ip          = $request->ip();
            $deviceType  = $this->detectDevice($ua);
            $browser     = $this->detectBrowser($ua);
            $os          = $this->detectOS($ua);
            $country     = $this->detectCountry($request);
            $fingerprint = md5($ip . $deviceType . $browser . $os);

            $isKnown = UserLoginSession::where('user_id', $user->id)
                ->where('fingerprint', $fingerprint)
                ->exists();

            UserLoginSession::create([
                'user_id'     => $user->id,
                'ip_address'  => $ip,
                'device_type' => $deviceType,
                'browser'     => $browser,
                'os'          => $os,
                'country'     => $country,
                'user_agent'  => substr($ua, 0, 500),
                'fingerprint' => $fingerprint,
            ]);

            if (! $isKnown) {
                $frontendUrl = rtrim(
                    env('FRONTEND_URL') ?: 'http://localhost:5000', '/'
                );

                Mail::to($user->email)->send(new NewDeviceLoginMail(
                    userName:          $user->name,
                    ipAddress:         $ip,
                    deviceType:        $deviceType,
                    browser:           $browser,
                    os:                $os,
                    country:           $country,
                    loginTime:         now()->format('D, d M Y H:i') . ' UTC',
                    changePasswordUrl: $frontendUrl . '/forgot-password',
                ));
            }
        } catch (\Throwable) {
            // Never block login due to tracking errors
        }
    }

    private function detectDevice(string $ua): string
    {
        if (preg_match('/tablet|ipad|playbook|silk/i', $ua)) return 'tablet';
        if (preg_match('/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i', $ua)) return 'mobile';
        return 'desktop';
    }

    private function detectBrowser(string $ua): string
    {
        if (preg_match('/Edg\//i', $ua))     return 'Edge';
        if (preg_match('/OPR\//i', $ua))     return 'Opera';
        if (preg_match('/Chrome\//i', $ua))  return 'Chrome';
        if (preg_match('/Safari\//i', $ua))  return 'Safari';
        if (preg_match('/Firefox\//i', $ua)) return 'Firefox';
        if (preg_match('/MSIE|Trident/i', $ua)) return 'IE';
        return 'Other';
    }

    private function detectOS(string $ua): string
    {
        if (preg_match('/Windows NT/i', $ua))      return 'Windows';
        if (preg_match('/Mac OS X/i', $ua))        return 'macOS';
        if (preg_match('/Android/i', $ua))         return 'Android';
        if (preg_match('/iPhone|iPad|iPod/i', $ua)) return 'iOS';
        if (preg_match('/Linux/i', $ua))           return 'Linux';
        return 'Other';
    }

    private function detectCountry(Request $request): ?string
    {
        $cf = $request->header('CF-IPCountry');
        if ($cf && $cf !== 'XX') return $cf;
        return null;
    }

    private function formatUser(User $user): array
    {
        $avatarUrl = null;
        if ($user->professional_agent_id) {
            $agent    = \App\Models\Agent::find($user->professional_agent_id);
            $avatarId = $agent?->avatar_id;
            if ($avatarId) {
                $avatarUrl = (str_starts_with($avatarId, 'http') || str_starts_with($avatarId, '/'))
                    ? $avatarId
                    : "/storage/{$avatarId}";
            }
        }

        return [
            'id'                              => $user->id,
            'name'                            => $user->name,
            'email'                           => $user->email,
            'phone'                           => $user->phone ?? null,
            'role'                            => $user->role,
            'email_verified'                  => ! is_null($user->email_verified_at),
            'account_type'                    => $user->account_type ?? 'individual',
            'company_name'                    => $user->company_name ?? null,
            'license_number'                  => $user->license_number ?? null,
            'professional_status'             => $user->professional_status,
            'professional_agent_id'           => $user->professional_agent_id,
            'professional_bio'                => $user->professional_bio,
            'professional_specialty'          => $user->professional_specialty,
            'professional_experience_years'   => $user->professional_experience_years,
            'professional_phone'              => $user->professional_phone,
            'professional_city_id'            => $user->professional_city_id,
            'professional_applied_at'         => $user->professional_applied_at,
            'professional_reject_reason'      => $user->professional_reject_reason,
            'avatar_url'                      => $avatarUrl,
        ];
    }
}
