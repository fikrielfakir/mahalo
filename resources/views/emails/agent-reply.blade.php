@extends('emails.layout')

@section('title', 'Message from ' . $agentName . ' — ' . config('app.name'))

@section('content')
  <p class="greeting">You have a new message</p>
  <p class="subtitle">
    Hello <strong>{{ $recipientName }}</strong>,<br /><br />
    <strong style="color:#730D26;">{{ $agentName }}</strong> has replied to your inquiry. Please find their message below.
  </p>

  <div class="info-card">
    <p>{{ $replyBody }}</p>
  </div>

  @if($originalMessage)
  <hr class="divider" />
  <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#9ca3af;margin-bottom:10px;">Your original message</p>
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:16px 20px;">
    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;font-style:italic;">{{ $originalMessage }}</p>
  </div>
  @endif
@endsection

@section('footer_text', 'You received this email because you contacted an agent on ' . config('app.name') . '. If this was not you, please disregard this message.')
