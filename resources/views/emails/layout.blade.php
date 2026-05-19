<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', config('app.name'))</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f4f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #1f2937;
    }
    .outer { padding: 48px 16px; }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,.08);
    }
    /* Top accent bar */
    .accent-bar {
      height: 4px;
      background: linear-gradient(90deg, #730D26 0%, #BA1932 100%);
    }
    /* Header */
    .header {
      background: #ffffff;
      padding: 32px 48px 24px;
      border-bottom: 1px solid #f0f0f0;
    }
    .header img {
      height: 36px;
      width: auto;
      display: block;
    }
    /* Body */
    .body { padding: 40px 48px; }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    .subtitle {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.7;
      margin-bottom: 32px;
    }
    /* CTA Button */
    .btn-wrap { text-align: center; margin: 32px 0; }
    .btn {
      display: inline-block;
      background: #730D26;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 14px 40px;
      border-radius: 4px;
      letter-spacing: 0.3px;
    }
    /* Info Card */
    .info-card {
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-left: 3px solid #730D26;
      border-radius: 4px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .info-card p {
      font-size: 15px;
      color: #374151;
      line-height: 1.7;
      margin: 0;
    }
    /* Warning Card */
    .warn-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 3px solid #d97706;
      border-radius: 4px;
      padding: 16px 20px;
      margin: 24px 0;
    }
    .warn-card p {
      font-size: 13px;
      color: #92400e;
      margin: 0;
      line-height: 1.7;
    }
    /* Detail rows */
    .detail-table {
      width: 100%;
      border-collapse: collapse;
    }
    .detail-table tr {
      border-bottom: 1px solid #f3f4f6;
    }
    .detail-table tr:last-child {
      border-bottom: none;
    }
    .detail-table td {
      padding: 10px 0;
      font-size: 14px;
      vertical-align: top;
    }
    .detail-label {
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.7px;
      width: 90px;
      padding-top: 12px;
    }
    .detail-value {
      color: #1f2937;
      font-weight: 500;
      padding-top: 10px;
    }
    /* Link fallback */
    .link-fallback {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 14px 18px;
      margin: 16px 0;
      word-break: break-all;
    }
    .link-fallback a {
      font-size: 12px;
      color: #730D26;
      text-decoration: none;
    }
    /* Divider */
    .divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 32px 0;
    }
    .fallback-label {
      font-size: 12px;
      color: #9ca3af;
      text-align: center;
      margin-bottom: 8px;
    }
    /* Footer */
    .footer {
      background: #f9fafb;
      border-top: 1px solid #f0f0f0;
      padding: 28px 48px;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.8;
    }
    .footer a {
      color: #730D26;
      text-decoration: none;
      font-weight: 500;
    }
    .footer .brand {
      font-weight: 700;
      color: #6b7280;
      font-size: 12px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    @media (max-width: 640px) {
      .body, .header, .footer { padding-left: 24px; padding-right: 24px; }
    }
  </style>
</head>
<body>
<div class="outer">
  <div class="wrapper">
    <div class="accent-bar"></div>

    <div class="header">
      <img src="{{ rtrim(config('app.url'), '/') }}/logo-dark.png" alt="{{ config('app.name') }}" />
    </div>

    <div class="body">
      @yield('content')
    </div>

    <div class="footer">
      <p class="brand">{{ config('app.name') }}</p>
      <p>
        @yield('footer_text', 'If you did not request this email, you can safely ignore it.')
        <br />
        &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
      </p>
    </div>
  </div>
</div>
</body>
</html>
