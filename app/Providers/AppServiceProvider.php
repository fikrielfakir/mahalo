<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $frontendUrl = rtrim(
            env('FRONTEND_URL')
                ?: (env('REPLIT_DEV_DOMAIN') ? 'https://' . env('REPLIT_DEV_DOMAIN') : 'http://localhost:5000'),
            '/'
        );

        VerifyEmail::createUrlUsing(function ($notifiable) use ($frontendUrl) {
            $id      = $notifiable->getKey();
            $hash    = sha1($notifiable->getEmailForVerification());
            $expires = Carbon::now()->addMinutes(60)->timestamp;
            $sig     = hash_hmac('sha256', "{$id}|{$hash}|{$expires}", config('app.key'));
            return "{$frontendUrl}/email/verify/{$id}/{$hash}?expires={$expires}&signature={$sig}";
        });

        ResetPassword::createUrlUsing(function ($notifiable, string $token) use ($frontendUrl) {
            $email = urlencode($notifiable->getEmailForVerification());
            return "{$frontendUrl}/reset-password?token={$token}&email={$email}";
        });
    }
}
