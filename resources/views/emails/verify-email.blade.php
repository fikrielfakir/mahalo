@extends('emails.layout')

@section('title', 'Verify your email — ' . config('app.name'))

@section('content')
  <p class="greeting">Verify your email ✉️</p>
  <p class="subtitle">
    Hello <strong>{{ $userName }}</strong>, welcome to {{ config('app.name') }}!<br />
    Please confirm your email address to activate your account and start exploring properties.
  </p>

  <div class="btn-wrap">
    <a href="{{ $verificationUrl }}" class="btn">Verify My Email</a>
  </div>

  <div class="warn-card">
    <p>⏰ This link expires in <strong>60 minutes</strong>. If it expires, you can request a new one from your account settings.</p>
  </div>

  <hr class="divider" />

  <p style="font-size:13px;color:#9ca3af;text-align:center;">
    Button not working? Copy and paste this link into your browser:
  </p>
  <div class="link-fallback">
    <a href="{{ $verificationUrl }}">{{ $verificationUrl }}</a>
  </div>
@endsection

@section('footer_text', 'If you did not create a ' . config('app.name') . ' account, please ignore this email.')
