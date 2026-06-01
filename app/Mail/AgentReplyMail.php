<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $agentName,
        public string $replyBody,
        public string $recipientName,
        public ?string $originalMessage,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reply from ' . $this->agentName . ' – Mahalo',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-reply',
        );
    }
}
