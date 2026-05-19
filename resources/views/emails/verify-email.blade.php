@extends('emails.layout')

@section('title', 'Verify your email address — ' . config('app.name'))

@section('content')
  <p class="greeting">Confirm your email address</p>
  <p class="subtitle">
    Hello <strong>{{ $userName }}</strong>,<br /><br />
    Thank you for creating an account on {{ config('app.name') }}. To complete your registration and activate your account, please confirm your email address by clicking the button below.
  </p>

  <div class="btn-wrap">
    <a href="{{ $verificationUrl }}" class="btn">Confirm Email Address</a>
  </div>

  <div class="warn-card">
    <p>This confirmation link will expire in <strong>60 minutes</strong>. If it expires, you can request a new one from your account settings.</p>
  </div>

  <hr class="divider" />

  <p class="fallback-label">If the button above does not work, copy and paste the link below into your browser:</p>
  <div class="link-fallback">
    <a href="{{ $verificationUrl }}">{{ $verificationUrl }}</a>
  </div>
@endsection

@section('footer_text', 'If you did not create a ' . config('app.name') . ' account, please disregard this email.')
