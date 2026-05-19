<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nouvelles correspondances — Mahalo</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .header { background: linear-gradient(135deg, #730D26, #BA1932); padding: 40px 32px; text-align: center; }
    .header img { height: 36px; margin-bottom: 16px; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; line-height: 1.3; }
    .header p { color: rgba(255,255,255,.75); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .search-pill { display: inline-block; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 30px; padding: 6px 16px; font-size: 13px; color: #52525b; margin-bottom: 24px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #a1a1aa; margin-bottom: 16px; }
    .property-card { border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; margin-bottom: 16px; }
    .property-img { width: 100%; height: 180px; object-fit: cover; background: #f4f4f5; }
    .property-info { padding: 16px 20px; }
    .property-name { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 6px; }
    .property-meta { font-size: 13px; color: #71717a; margin: 0 0 12px; }
    .property-price { font-size: 16px; font-weight: 700; color: #730D26; margin: 0 0 14px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #730D26, #BA1932); color: #fff; text-decoration: none; padding: 10px 22px; border-radius: 30px; font-size: 13px; font-weight: 600; }
    .footer { padding: 24px 32px; border-top: 1px solid #f4f4f5; text-align: center; }
    .footer p { font-size: 12px; color: #a1a1aa; margin: 4px 0; }
    .footer a { color: #730D26; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🏡 Nouveaux biens pour vous !</h1>
      <p>{{ count($properties) }} nouveau{{ count($properties) > 1 ? 'x biens correspondent' : ' bien correspond' }} à votre recherche sauvegardée.</p>
    </div>

    <div class="body">
      @if($search->name)
        <p class="section-title">Votre recherche</p>
        <div class="search-pill">{{ $search->name }}</div>
      @endif

      <p class="section-title">{{ count($properties) }} bien{{ count($properties) > 1 ? 's' : '' }} correspondant{{ count($properties) > 1 ? 's' : '' }}</p>

      @foreach($properties as $prop)
        <div class="property-card">
          @if(!empty($prop['image']))
            <img class="property-img" src="{{ $prop['image'] }}" alt="{{ $prop['name'] }}" />
          @endif
          <div class="property-info">
            <p class="property-name">{{ $prop['name'] }}</p>
            <p class="property-meta">
              {{ ucfirst($prop['type'] ?? '') }}
              @if(!empty($prop['city'])) · {{ $prop['city'] }} @endif
              @if(!empty($prop['bedrooms'])) · {{ $prop['bedrooms'] }} ch. @endif
              @if(!empty($prop['area'])) · {{ $prop['area'] }} m² @endif
            </p>
            <p class="property-price">
              @if(!empty($prop['price']))
                {{ number_format($prop['price'], 0, ',', ' ') }} MAD
              @else
                Sur demande
              @endif
            </p>
            @if(!empty($prop['slug']))
              <a class="btn" href="{{ config('app.frontend_url', 'https://mahalo.ma') }}/properties/{{ $prop['slug'] }}">
                Voir l'annonce →
              </a>
            @endif
          </div>
        </div>
      @endforeach
    </div>

    <div class="footer">
      <p>Vous recevez cet email car vous avez sauvegardé une recherche sur <a href="{{ config('app.frontend_url', 'https://mahalo.ma') }}">Mahalo</a>.</p>
      <p>Pour vous désabonner, <a href="{{ config('app.frontend_url', 'https://mahalo.ma') }}/find-my-property">gérez vos recherches sauvegardées</a>.</p>
    </div>
  </div>
</body>
</html>
