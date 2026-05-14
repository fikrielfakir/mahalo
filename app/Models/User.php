<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Auth\Notifications\VerifyEmail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function sendEmailVerificationNotification(): void
    {
        $frontendUrl = rtrim(
            env('FRONTEND_URL')
                ?: (env('REPLIT_DEV_DOMAIN') ? 'https://' . env('REPLIT_DEV_DOMAIN') : 'http://localhost:5000'),
            '/'
        );

        $id      = $this->getKey();
        $hash    = sha1($this->getEmailForVerification());
        $expires = Carbon::now()->addMinutes(60)->timestamp;
        $sig     = hash_hmac('sha256', "{$id}|{$hash}|{$expires}", config('app.key'));
        $url     = "{$frontendUrl}/email/verify/{$id}/{$hash}?expires={$expires}&signature={$sig}";

        $notification = new VerifyEmail();
        $notification::createUrlUsing(fn () => $url);

        $this->notify($notification);
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'account_type',
        'company_name',
        'license_number',
        'email_verified_at',
        'professional_status',
        'professional_bio',
        'professional_specialty',
        'professional_experience_years',
        'professional_phone',
        'professional_city_id',
        'professional_applied_at',
        'professional_reject_reason',
        'professional_agent_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'professional_city_id');
    }
}
