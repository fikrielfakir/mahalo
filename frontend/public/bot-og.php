<?php
/**
 * bot-og.php — Dynamic OG tag injection for social media bots.
 *
 * Deployed alongside index.html in public_html/.
 * .htaccess routes known bots here; regular users never hit this file.
 *
 * Sets property/project-specific og:title, og:description, og:image, etc.
 * Falls back to the site-level OG image for all other pages.
 */

define('SITE_URL',    'https://mahalo.ma');
define('API_BASE',    'https://api.mahalo.ma');
define('SITE_NAME',   'Mahalo Immobilier');
define('DEFAULT_OG',  SITE_URL . '/og-image.png');
define('INDEX_HTML',  __DIR__ . '/index.html');

// ── helpers ──────────────────────────────────────────────────────────────────

function esc(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function fmt_price(mixed $price): string {
    if (!$price || $price <= 0) return '';
    return number_format((float)$price, 0, ',', "\xE2\x80\xAF") . ' MAD';
}

/**
 * Fetch JSON from URL; returns the `data` key or null on any error.
 * Uses cURL (preferred) with file_get_contents as fallback.
 */
function fetch_json(string $url): ?array {
    $raw = false;

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 6,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 3,
            CURLOPT_HTTPHEADER     => ['Accept: application/json', 'User-Agent: Mahalo-OG-Bot/1.0'],
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $raw = curl_exec($ch);
        if (curl_errno($ch)) $raw = false;
        curl_close($ch);
    }

    if ($raw === false) {
        $ctx = stream_context_create([
            'http' => ['timeout' => 6, 'ignore_errors' => true,
                       'header'  => "Accept: application/json\r\nUser-Agent: Mahalo-OG-Bot/1.0\r\n"],
            'ssl'  => ['verify_peer' => true],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
    }

    if (!$raw) return null;
    $json = json_decode($raw, true);
    if (!is_array($json) || !empty($json['error']) || empty($json['data'])) return null;
    return $json['data'];
}

/**
 * Pick the best image URL from a property/project data array.
 * Returns an absolute URL. Falls back to $defaultOg if no image found.
 */
function pick_image(array $data, string $defaultOg = DEFAULT_OG): string {
    $img = $data['image']
        ?? (isset($data['images'][0]) ? $data['images'][0] : null)
        ?? ($data['thumbnail_url'] ?? null)
        ?? '';
    if (!$img) return $defaultOg;
    if (str_starts_with($img, 'http')) return $img;
    return SITE_URL . '/storage/' . ltrim($img, '/');
}

/**
 * Strip all OG / Twitter / canonical / title tags from a <head> block
 * so we can replace them cleanly.
 */
function strip_og_tags(string $html): string {
    // Remove <title>...</title>
    $html = preg_replace('~<title[^>]*>.*?</title>~is', '', $html);
    // Remove <meta> tags related to OG, Twitter, description, robots
    $html = preg_replace(
        '~<meta\s[^>]*(?:property=["\'](?:og|twitter):|name=["\'](?:description|twitter:|robots))[^>]*/??>~is',
        '',
        $html
    );
    // Remove <link rel="canonical" ...>
    $html = preg_replace('~<link\s[^>]*rel=["\']canonical["\'][^>]*/??>~is', '', $html);
    return $html;
}

/**
 * Build the OG/Twitter meta block as a string.
 */
function build_og_tags(
    string $title,
    string $description,
    string $image,
    string $url,
    string $type = 'article'
): string {
    $t   = esc($title);
    $d   = esc($description);
    $img = esc($image);
    $u   = esc($url);
    $sn  = esc(SITE_NAME);

    return implode("\n    ", [
        "<title>{$t}</title>",
        "<meta name=\"description\" content=\"{$d}\" />",
        "<meta property=\"og:type\" content=\"{$type}\" />",
        "<meta property=\"og:site_name\" content=\"{$sn}\" />",
        "<meta property=\"og:title\" content=\"{$t}\" />",
        "<meta property=\"og:description\" content=\"{$d}\" />",
        "<meta property=\"og:url\" content=\"{$u}\" />",
        "<meta property=\"og:image\" content=\"{$img}\" />",
        "<meta property=\"og:image:width\" content=\"1200\" />",
        "<meta property=\"og:image:height\" content=\"630\" />",
        "<meta name=\"twitter:card\" content=\"summary_large_image\" />",
        "<meta name=\"twitter:title\" content=\"{$t}\" />",
        "<meta name=\"twitter:description\" content=\"{$d}\" />",
        "<meta name=\"twitter:image\" content=\"{$img}\" />",
        "<link rel=\"canonical\" href=\"{$u}\" />",
    ]);
}

// ── resolve OG meta from request path ────────────────────────────────────────

$path        = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$requestUrl  = SITE_URL . $path;

// Fetch site-level OG image from admin settings (versioned URL beats static fallback)
$siteOgImage = DEFAULT_OG;
$siteSettings = fetch_json(API_BASE . '/api/v1/public-settings');
if ($siteSettings && !empty($siteSettings['og_image_url'])) {
    $siteOgImage = $siteSettings['og_image_url'];
}

$title       = ($siteSettings['seo_title'] ?? null) ?: SITE_NAME . ' — Trouvez Votre Bien au Maroc';
$description = ($siteSettings['seo_description'] ?? null) ?: 'Découvrez des propriétés premium dans les quartiers les plus prestigieux du Maroc.';
$ogImage     = $siteOgImage;
$ogType      = 'website';

// ── Property page ─────────────────────────────────────────────────────────────
if (preg_match('~^/properties/([^/?#]+)~', $path, $m)) {
    $slug = rawurlencode($m[1]);
    $data = fetch_json(API_BASE . '/api/v1/properties/' . $slug);

    if ($data) {
        $name     = $data['name']                    ?? '';
        $city     = $data['city']['name']            ?? '';
        $price    = fmt_price($data['price']         ?? 0);
        $beds     = isset($data['number_bedroom'])   && $data['number_bedroom']  ? $data['number_bedroom']  . ' ch.'  : '';
        $baths    = isset($data['number_bathroom'])  && $data['number_bathroom'] ? $data['number_bathroom'] . ' sdb.' : '';
        $listType = ($data['type'] ?? '') === 'sale' ? 'À vendre' : 'À louer';

        $titleParts = array_filter([$name, $city ? "— $city" : '', $price ? "— $price" : '']);
        $title      = implode(' ', $titleParts) . ' | ' . SITE_NAME;

        $descParts  = array_filter([$listType, $name, $city ? "à $city" : '', 'Maroc.', $beds, $baths, $price ? "À partir de $price." : '']);
        $description = implode(' ', $descParts);

        $ogImage  = pick_image($data, $siteOgImage);
        $ogType   = 'article';
    }
}

// ── Project page ──────────────────────────────────────────────────────────────
elseif (preg_match('~^/projects/([^/?#]+)~', $path, $m)) {
    $slug = rawurlencode($m[1]);
    $data = fetch_json(API_BASE . '/api/v1/projects/' . $slug);

    if ($data) {
        $name  = $data['name']       ?? '';
        $city  = $data['city']['name'] ?? '';
        $price = fmt_price($data['price_from'] ?? 0);
        $desc  = strip_tags($data['description'] ?? '');
        $desc  = mb_substr($desc, 0, 200);

        $titleParts = array_filter([$name, $city ? "— $city" : '', $price ? "— À partir de $price" : '']);
        $title      = implode(' ', $titleParts) . ' | ' . SITE_NAME;

        $description = trim($name . ($city ? " à $city" : '') . ', Maroc. ' . ($desc ?: 'Découvrez ce projet immobilier premium.'));

        $ogImage = pick_image($data, $siteOgImage);
        $ogType  = 'article';
    }
}

// ── Build final HTML ──────────────────────────────────────────────────────────

$html = @file_get_contents(INDEX_HTML);
if ($html === false) {
    http_response_code(500);
    exit('index.html not found');
}

// Strip the generic OG tags baked into index.html
$html = strip_og_tags($html);

// Inject property/project-specific OG tags just before </head>
$ogBlock = build_og_tags($title, $description, $ogImage, $requestUrl, $ogType);
$html = str_replace('</head>', "    {$ogBlock}\n  </head>", $html);

// Fix the relative /og-image.png → absolute URL in case any stray tag survived
$html = str_replace('content="/og-image.png"', 'content="' . esc(DEFAULT_OG) . '"', $html);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
echo $html;
