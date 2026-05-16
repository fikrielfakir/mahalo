@extends('emails.layout')

@section('title', 'Reset your password — ' . config('app.name'))

@section('content')
  <p class="greeting">Reset your password 🔑</p>
  <p class="subtitle">
    Hello <strong>{{ $userName }}</strong>,<br />
    We received a request to reset the password for your {{ config('app.name') }} account.
    Click the button below to choose a new password.
  </p>

  <div class="btn-wrap">
    <a href="{{ $resetUrl }}" class="btn">Reset My Password</a>
  </div>

  <div class="warn-card">
    <p>⏰ This link expires in <strong>60 minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
  </div>

  <hr class="divider" />

  <p style="font-size:13px;color:#9ca3af;text-align:center;">
    Button not working? Copy and paste this link into your browser:
  </p>
  <div class="link-fallback">
    <a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
  </div>
@endsection

@section('footer_text', 'If you did not request a password reset, no action is needed.')
