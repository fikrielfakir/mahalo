@extends('emails.layout')

@section('title', 'New sign-in detected — ' . config('app.name'))

@section('content')
  <p class="greeting">New sign-in to your account</p>
  <p class="subtitle">
    Hello <strong>{{ $userName }}</strong>,<br /><br />
    We detected a sign-in to your {{ config('app.name') }} account from a new device or location. Please review the details below.
  </p>

  <div class="info-card">
    <table class="detail-table">
      <tr>
        <td class="detail-label">Date</td>
        <td class="detail-value">{{ $loginTime }}</td>
      </tr>
      <tr>
        <td class="detail-label">IP Address</td>
        <td class="detail-value">{{ $ipAddress }}</td>
      </tr>
      @if($country)
      <tr>
        <td class="detail-label">Country</td>
        <td class="detail-value">{{ $country }}</td>
      </tr>
      @endif
      <tr>
        <td class="detail-label">Device</td>
        <td class="detail-value" style="text-transform:capitalize;">{{ $deviceType }}</td>
      </tr>
      <tr>
        <td class="detail-label">Browser</td>
        <td class="detail-value">{{ $browser }}</td>
      </tr>
      <tr>
        <td class="detail-label">OS</td>
        <td class="detail-value">{{ $os }}</td>
      </tr>
    </table>
  </div>

  <div class="warn-card">
    <p>
      <strong>Was this you?</strong> If you recognise this sign-in, no further action is required.<br /><br />
      If you do not recognise this activity, we recommend changing your password immediately to secure your account.
    </p>
  </div>

  <div class="btn-wrap">
    <a href="{{ $changePasswordUrl }}" class="btn">Secure My Account</a>
  </div>
@endsection

@section('footer_text', 'You received this security alert because a new sign-in was detected on your account.')
