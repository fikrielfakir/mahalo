<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return response()->json([
            'data'    => ['url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5000'));
            return redirect($frontendUrl . '/auth/google/callback?error=google_auth_failed');
        }

        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        } else {
            $user = User::create([
                'name'              => $googleUser->getName(),
                'email'             => $googleUser->getEmail(),
                'google_id'         => $googleUser->getId(),
                'password'          => bcrypt(Str::random(32)),
                'role'              => 'user',
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('google-token')->plainTextToken;

        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5000'));

        return redirect($frontendUrl . '/auth/google/callback?token=' . $token);
    }
}
