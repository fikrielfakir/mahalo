<?php

namespace App\Http\Middleware;

use App\Models\PageView;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    private const BOT_PATTERN = '/googlebot|bingbot|slurp|yandex|baidu|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|embedly|ia_archiver|semrushbot|ahrefsbot|msnbot|teoma|rogerbot|crawler|spider|bot\b/i';

    private const IGNORE_PATHS = ['/api/', '/storage/', '/_vite', '/__vite', '/favicon'];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        try {
            $path = $request->path();

            foreach (self::IGNORE_PATHS as $ignore) {
                if (str_contains('/' . $path, $ignore)) {
                    return $response;
                }
            }

            $ua  = $request->userAgent() ?? '';
            $geo = $this->resolveGeo($request);

            PageView::create([
                'session_id'   => $this->getSessionId($request),
                'ip_address'   => $request->ip(),
                'page'         => '/' . $path,
                'referrer'     => $request->header('Referer'),
                'country'      => $geo['country'],
                'country_code' => $geo['country_code'],
                'city'         => $geo['city'],
                'device_type'  => $this->detectDevice($ua),
                'browser'      => $this->detectBrowser($ua),
                'os'           => $this->detectOS($ua),
                'user_agent'   => substr($ua, 0, 500),
                'is_bot'       => (bool) preg_match(self::BOT_PATTERN, $ua),
            ]);
        } catch (\Throwable) {
        }

        return $response;
    }

    private function resolveGeo(Request $request): array
    {
        // 1. Cloudflare headers (production)
        $cfCountry = $request->header('CF-IPCountry');
        $cfCity    = $request->header('CF-IPCity');

        if ($cfCountry && $cfCountry !== 'XX') {
            return [
                'country'      => $this->countryName($cfCountry),
                'country_code' => strtoupper($cfCountry),
                'city'         => ($cfCity && $cfCity !== 'XX' && $cfCity !== '-')
                                  ? urldecode($cfCity)
                                  : null,
            ];
        }

        // 2. Custom headers (X-Country / X-City)
        $xCountry = $request->header('X-Country');
        $xCity    = $request->header('X-City');
        if ($xCountry) {
            return [
                'country'      => $xCountry,
                'country_code' => null,
                'city'         => $xCity ?: null,
            ];
        }

        // 3. IP-based geolocation fallback (cached per IP for 24 h)
        $ip = $request->ip();

        // Skip private / loopback addresses
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return ['country' => null, 'country_code' => null, 'city' => null];
        }

        return Cache::remember("geo:{$ip}", 86400, function () use ($ip) {
            try {
                $ctx = stream_context_create(['http' => ['timeout' => 2]]);
                $raw = @file_get_contents(
                    "http://ip-api.com/json/{$ip}?fields=status,country,countryCode,city",
                    false,
                    $ctx
                );
                if (!$raw) {
                    return ['country' => null, 'country_code' => null, 'city' => null];
                }
                $data = json_decode($raw, true);
                if (($data['status'] ?? '') !== 'success') {
                    return ['country' => null, 'country_code' => null, 'city' => null];
                }
                return [
                    'country'      => $data['country']     ?? null,
                    'country_code' => $data['countryCode'] ?? null,
                    'city'         => $data['city']        ?? null,
                ];
            } catch (\Throwable) {
                return ['country' => null, 'country_code' => null, 'city' => null];
            }
        });
    }

    private function getSessionId(Request $request): string
    {
        $cookie = $request->cookie('_hvid');
        if ($cookie) {
            return substr($cookie, 0, 64);
        }
        return substr(md5($request->ip() . ($request->userAgent() ?? '') . date('Y-m-d')), 0, 32);
    }

    private function countryName(string $code): string
    {
        $map = [
            'US' => 'United States', 'GB' => 'United Kingdom', 'FR' => 'France',
            'DE' => 'Germany', 'CA' => 'Canada', 'AU' => 'Australia',
            'IN' => 'India', 'BR' => 'Brazil', 'JP' => 'Japan', 'CN' => 'China',
            'MA' => 'Morocco', 'DZ' => 'Algeria', 'TN' => 'Tunisia', 'EG' => 'Egypt',
            'SA' => 'Saudi Arabia', 'AE' => 'UAE', 'TR' => 'Turkey', 'ID' => 'Indonesia',
            'RU' => 'Russia', 'MX' => 'Mexico', 'ES' => 'Spain', 'IT' => 'Italy',
            'NL' => 'Netherlands', 'SE' => 'Sweden', 'NO' => 'Norway', 'CH' => 'Switzerland',
            'BE' => 'Belgium', 'PL' => 'Poland', 'PT' => 'Portugal', 'GR' => 'Greece',
            'ZA' => 'South Africa', 'NG' => 'Nigeria', 'KE' => 'Kenya', 'GH' => 'Ghana',
            'PK' => 'Pakistan', 'BD' => 'Bangladesh', 'PH' => 'Philippines',
            'VN' => 'Vietnam', 'TH' => 'Thailand', 'MY' => 'Malaysia', 'SG' => 'Singapore',
            'KR' => 'South Korea', 'HK' => 'Hong Kong', 'TW' => 'Taiwan', 'NZ' => 'New Zealand',
            'AR' => 'Argentina', 'CO' => 'Colombia', 'CL' => 'Chile', 'PE' => 'Peru',
            'LY' => 'Libya', 'SD' => 'Sudan', 'IQ' => 'Iraq', 'SY' => 'Syria',
            'JO' => 'Jordan', 'LB' => 'Lebanon', 'KW' => 'Kuwait', 'QA' => 'Qatar',
            'OM' => 'Oman', 'BH' => 'Bahrain', 'YE' => 'Yemen',
        ];
        return $map[$code] ?? $code;
    }

    private function detectDevice(string $ua): string
    {
        if (preg_match('/tablet|ipad|playbook|silk/i', $ua)) {
            return 'tablet';
        }
        if (preg_match('/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i', $ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    private function detectBrowser(string $ua): string
    {
        if (preg_match('/Edg\//i', $ua))        return 'Edge';
        if (preg_match('/OPR\//i', $ua))        return 'Opera';
        if (preg_match('/Chrome\//i', $ua))     return 'Chrome';
        if (preg_match('/Safari\//i', $ua))     return 'Safari';
        if (preg_match('/Firefox\//i', $ua))    return 'Firefox';
        if (preg_match('/MSIE|Trident/i', $ua)) return 'IE';
        return 'Other';
    }

    private function detectOS(string $ua): string
    {
        if (preg_match('/Windows NT/i', $ua))       return 'Windows';
        if (preg_match('/Mac OS X/i', $ua))         return 'macOS';
        if (preg_match('/Android/i', $ua))          return 'Android';
        if (preg_match('/iPhone|iPad|iPod/i', $ua)) return 'iOS';
        if (preg_match('/Linux/i', $ua))            return 'Linux';
        return 'Other';
    }
}
