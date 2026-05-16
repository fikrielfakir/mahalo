@extends('emails.layout')

@section('title', 'Reply from ' . $agentName . ' — ' . config('app.name'))

@section('content')
  <p class="greeting">New reply from your agent</p>
  <p class="subtitle">
    Hello <strong>{{ $recipientName }}</strong>,<br />
    You have received a reply from <strong style="color:#730D26;">{{ $agentName }}</strong>:
  </p>

  <div class="info-card">
    <p>{{ $replyBody }}</p>
  </div>

  @if($originalMessage)
  <hr class="divider" />
  <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#9ca3af;margin-bottom:8px;">Your original message</p>
  <div style="background:#f9fafb;border-radius:10px;padding:14px 18px;">
    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;font-style:italic;">{{ $originalMessage }}</p>
  </div>
  @endif
@endsection

@section('footer_text', 'You received this email because you contacted an agent on ' . config('app.name') . '. If this was not you, please ignore.')
