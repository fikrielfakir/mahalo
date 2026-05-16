<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', config('app.name'))</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f0f2f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .outer { padding: 40px 16px; }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,.10);
    }
    /* Header */
    .header {
      background: linear-gradient(135deg, #730D26 0%, #BA1932 100%);
      padding: 36px 48px;
      text-align: center;
    }
    .header-logo {
      display: inline-block;
      margin-bottom: 10px;
    }
    .header-logo img {
      height: 40px;
      width: auto;
      display: block;
    }
    .header-icon {
      width: 64px; height: 64px;
      background: rgba(255,255,255,.15);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px;
    }
    /* Body */
    .body { padding: 40px 48px; }
    .greeting {
      font-size: 22px; font-weight: 700;
      color: #111827; margin-bottom: 8px;
    }
    .subtitle {
      font-size: 15px; color: #6b7280; line-height: 1.6; margin-bottom: 28px;
    }
    /* CTA Button */
    .btn-wrap { text-align: center; margin: 32px 0; }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #730D26 0%, #BA1932 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 700;
      padding: 14px 36px;
      border-radius: 50px;
      letter-spacing: 0.2px;
      box-shadow: 0 4px 16px rgba(115,13,38,.35);
    }
    /* Info Card */
    .info-card {
      background: #fdf8f9;
      border: 1px solid #f0d4d9;
      border-left: 4px solid #730D26;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .info-card p {
      font-size: 14px; color: #374151; line-height: 1.7; margin: 0;
    }
    /* Warning Card */
    .warn-card {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .warn-card p { font-size: 13px; color: #92400e; margin: 0; line-height: 1.6; }
    /* Detail rows */
    .detail-row {
      display: flex; gap: 12px; align-items: flex-start;
      padding: 10px 0; border-bottom: 1px solid #f3f4f6;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; min-width: 80px; padding-top: 2px; }
    .detail-value { font-size: 14px; color: #1f2937; font-weight: 500; }
    /* Link fallback */
    .link-fallback {
      background: #f9fafb; border-radius: 10px;
      padding: 14px 18px; margin: 16px 0;
      word-break: break-all;
    }
    .link-fallback a { font-size: 12px; color: #730D26; text-decoration: none; }
    /* Divider */
    .divider { border: none; border-top: 1px solid #f3f4f6; margin: 28px 0; }
    /* Footer */
    .footer {
      background: #f9fafb;
      border-top: 1px solid #f0f0f0;
      padding: 28px 48px;
      text-align: center;
    }
    .footer p { font-size: 12px; color: #9ca3af; line-height: 1.8; }
    .footer a { color: #730D26; text-decoration: none; font-weight: 500; }
    .footer .brand { font-weight: 700; color: #4b5563; font-size: 13px; margin-bottom: 4px; }
    @media (max-width: 640px) {
      .body, .header, .footer { padding-left: 24px; padding-right: 24px; }
    }
  </style>
</head>
<body>
<div class="outer">
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">
        <img src="{{ rtrim(config('app.url'), '/') }}/logo-light.png" alt="{{ config('app.name') }}" />
      </div>
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
