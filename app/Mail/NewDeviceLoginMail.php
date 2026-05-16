<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewDeviceLoginMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string  $userName,
        public string  $ipAddress,
        public string  $deviceType,
        public string  $browser,
        public string  $os,
        public ?string $country,
        public string  $loginTime,
        public string  $changePasswordUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⚠️ New sign-in detected — ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.new-device-login');
    }
}
