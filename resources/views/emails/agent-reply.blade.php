<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reply from {{ $agentName }}</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
    .header { background: #730D26; padding: 32px 40px; text-align: center; }
    .header img { height: 36px; }
    .header h1 { color: #ffffff; margin: 12px 0 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 15px; color: #1a1a2e; font-weight: 600; margin-bottom: 6px; }
    .reply-box { background: #fdf8f9; border-left: 4px solid #730D26; border-radius: 8px; padding: 20px 24px; margin: 20px 0; }
    .reply-box p { margin: 0; font-size: 15px; color: #374151; line-height: 1.7; white-space: pre-wrap; }
    .divider { border: none; border-top: 1px solid #f0f0f0; margin: 28px 0; }
    .original-section { margin-top: 8px; }
    .original-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #9ca3af; margin-bottom: 8px; }
    .original-box { background: #f9fafb; border-radius: 8px; padding: 14px 18px; }
    .original-box p { margin: 0; font-size: 13px; color: #6b7280; line-height: 1.6; font-style: italic; }
    .footer { background: #f9fafb; padding: 24px 40px; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6; }
    .footer a { color: #730D26; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Mahalo Real Estate</h1>
    </div>

    <div class="body">
      <p class="greeting">Hello {{ $recipientName }},</p>
      <p style="font-size:14px;color:#6b7280;margin:4px 0 0;">
        You have received a reply from <strong style="color:#730D26;">{{ $agentName }}</strong>:
      </p>

      <div class="reply-box">
        <p>{{ $replyBody }}</p>
      </div>

      @if($originalMessage)
      <hr class="divider" />
      <div class="original-section">
        <p class="original-label">Your original message</p>
        <div class="original-box">
          <p>{{ $originalMessage }}</p>
        </div>
      </div>
      @endif
    </div>

    <div class="footer">
      <p>
        This email was sent via <a href="#">Mahalo Real Estate</a>.<br />
        If you did not contact an agent, please disregard this email.
      </p>
    </div>
  </div>
</body>
</html>
