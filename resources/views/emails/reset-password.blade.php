@extends('emails.layout')

@section('title', 'Reset your password — ' . config('app.name'))

@section('content')
  <p class="greeting">Password reset request</p>
  <p class="subtitle">
    Hello <strong>{{ $userName }}</strong>,<br /><br />
    We received a request to reset the password associated with your {{ config('app.name') }} account. Click the button below to choose a new password.
  </p>

  <div class="btn-wrap">
    <a href="{{ $resetUrl }}" class="btn">Reset Password</a>
  </div>

  <div class="warn-card">
    <p>
      This link expires in <strong>60 minutes</strong>.<br />
      If you did not request a password reset, no further action is required. Your password will remain unchanged.
    </p>
  </div>

  <hr class="divider" />

  <p class="fallback-label">If the button above does not work, copy and paste the link below into your browser:</p>
  <div class="link-fallback">
    <a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
  </div>
@endsection

@section('footer_text', 'If you did not request a password reset, please ignore this email.')
