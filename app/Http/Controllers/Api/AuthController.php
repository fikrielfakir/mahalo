<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

        event(new Registered($user));

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'data' => [
                'token'          => $token,
                'token_type'     => 'Bearer',
                'email_verified' => false,
                'user'           => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
            'error'   => false,
            'message' => 'Registration successful. Please check your email to verify your account.',
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

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'data' => [
                'token'          => $token,
                'token_type'     => 'Bearer',
                'email_verified' => ! is_null($user->email_verified_at),
                'user'           => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
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
        $user = $request->user();
        return response()->json([
            'data' => [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $user->phone ?? null,
                'role'           => $user->role,
                'email_verified' => ! is_null($user->email_verified_at),
            ],
            'error'   => false,
            'message' => null,
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
}
