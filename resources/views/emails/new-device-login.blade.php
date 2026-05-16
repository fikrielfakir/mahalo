@extends('emails.layout')

@section('title', 'New sign-in detected — ' . config('app.name'))

@section('content')
  <p class="greeting">New sign-in detected 🔐</p>
  <p class="subtitle">
    Hello <strong>{{ $userName }}</strong>,<br />
    We noticed a sign-in to your {{ config('app.name') }} account from a new device or location.
    Here are the details:
  </p>

  <div class="info-card">
    <div class="detail-row">
      <span class="detail-label">📅 Date</span>
      <span class="detail-value">{{ $loginTime }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">📍 IP</span>
      <span class="detail-value">{{ $ipAddress }}</span>
    </div>
    @if($country)
    <div class="detail-row">
      <span class="detail-label">🌍 Country</span>
      <span class="detail-value">{{ $country }}</span>
    </div>
    @endif
    <div class="detail-row">
      <span class="detail-label">💻 Device</span>
      <span class="detail-value" style="text-transform:capitalize;">{{ $deviceType }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">🌐 Browser</span>
      <span class="detail-value">{{ $browser }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">🖥️ OS</span>
      <span class="detail-value">{{ $os }}</span>
    </div>
  </div>

  <div class="warn-card">
    <p>
      ⚠️ <strong>Was this you?</strong> If you recognise this sign-in, no action is needed.<br />
      If this wasn't you, please change your password immediately to secure your account.
    </p>
  </div>

  <div class="btn-wrap">
    <a href="{{ $changePasswordUrl }}" class="btn">Secure My Account</a>
  </div>
@endsection

@section('footer_text', 'You received this alert because a new sign-in was detected on your account.')
