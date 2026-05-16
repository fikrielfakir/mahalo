<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends ResetPassword
{
    protected string $customUrl;

    public function __construct(string $token, string $url)
    {
        parent::__construct($token);
        $this->customUrl = $url;
    }

    protected function buildMailMessage($url): MailMessage
    {
        return (new MailMessage)
            ->subject('Reset your password — ' . config('app.name'))
            ->view('emails.reset-password', [
                'resetUrl' => $this->customUrl,
                'userName' => $this->notifiable->name ?? 'there',
            ]);
    }
}
