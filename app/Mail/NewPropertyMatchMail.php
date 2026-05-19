<?php

namespace App\Mail;

use App\Models\SavedSearch;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPropertyMatchMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public SavedSearch $search,
        public array $properties,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🏡 Mahalo — ' . count($this->properties) . ' nouveau' . (count($this->properties) > 1 ? 'x biens' : ' bien') . ' correspond à votre recherche',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-property-match',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
