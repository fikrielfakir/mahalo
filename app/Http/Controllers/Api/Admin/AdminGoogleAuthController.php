<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AdminGoogleAuthController extends Controller
{
    public function redirect()
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->with(['state' => 'admin'])
            ->redirect()
            ->getTargetUrl();

        return response()->json([
            'data'    => ['url' => $url],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function callback()
    {
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5000'));
        $redirectBase = $frontendUrl . '/admin/auth/google/callback';

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect($redirectBase . '?error=google_auth_failed');
        }

        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            return redirect($redirectBase . '?error=not_authorized');
        }

        if (!in_array($user->role, ['admin', 'manager'])) {
            return redirect($redirectBase . '?error=not_admin');
        }

        if (!$user->google_id) {
            $user->update(['google_id' => $googleUser->getId()]);
        }

        $token = $user->createToken('admin-google-token')->plainTextToken;

        return redirect($redirectBase . '?token=' . $token);
    }
}
