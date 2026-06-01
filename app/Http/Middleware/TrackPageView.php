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

            $ua      = $request->userAgent() ?? '';
            $realIp  = $this->realIp($request);
            $geo     = $this->resolveGeo($request);

            PageView::create([
                'session_id'   => $this->getSessionId($request),
                'ip_address'   => $realIp,
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
        // 1. Cloudflare headers — most accurate when CF proxy is active
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

        // 3. Resolve the real visitor IP (not the proxy/CDN edge IP)
        $ip = $this->realIp($request);

        // Skip private / loopback / unroutable addresses
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return ['country' => null, 'country_code' => null, 'city' => null];
        }

        // 4. Serve from cache if a successful result was stored previously
        $cacheKey = "geo:{$ip}";
        $cached   = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        // 5. Live ip-api.com lookup — only cache on success so failures are retried
        $geo = $this->fetchIpApi($ip);

        if ($geo['country'] !== null) {
            Cache::put($cacheKey, $geo, 86400); // 24 h — only on success
        }

        return $geo;
    }

    /**
     * Extract the real visitor IP, preferring Cloudflare / proxy headers
     * over the socket-level IP which is often the CDN edge node.
     */
    private function realIp(Request $request): string
    {
        // CF-Connecting-IP is the most reliable when behind Cloudflare
        $cfIp = $request->header('CF-Connecting-IP');
        if ($cfIp && filter_var(trim($cfIp), FILTER_VALIDATE_IP)) {
            return trim($cfIp);
        }

        // X-Forwarded-For: take the first public IP in the chain
        $xff = $request->header('X-Forwarded-For');
        if ($xff) {
            foreach (array_map('trim', explode(',', $xff)) as $candidate) {
                if (filter_var($candidate, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $candidate;
                }
            }
        }

        return $request->ip();
    }

    private function fetchIpApi(string $ip): array
    {
        try {
            $ctx = stream_context_create(['http' => ['timeout' => 3]]);
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
    }

    private function getSessionId(Request $request): string
    {
        $cookie = $request->cookie('_hvid');
        if ($cookie) {
            return substr($cookie, 0, 64);
        }
        return substr(md5($this->realIp($request) . ($request->userAgent() ?? '') . date('Y-m-d')), 0, 32);
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
