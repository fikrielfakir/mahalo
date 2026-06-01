<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackViewController extends Controller
{
    private const BOT_PATTERN = '/googlebot|bingbot|slurp|yandex|baidu|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|embedly|ia_archiver|semrushbot|ahrefsbot|msnbot|teoma|rogerbot|crawler|spider|bot\b/i';

    public function store(Request $request): JsonResponse
    {
        try {
            $page     = $request->input('page', '/');
            $referrer = $request->input('referrer');
            $sid      = $request->input('session_id');
            $ua       = $request->input('user_agent') ?: ($request->userAgent() ?? '');

            // Ignore non-page paths
            if (str_starts_with($page, '/api/') || str_starts_with($page, '/storage/')) {
                return response()->json(['ok' => true]);
            }

            PageView::create([
                'session_id'   => $sid ? substr($sid, 0, 64) : $this->fallbackSession($request),
                'ip_address'   => $request->ip(),
                'page'         => substr($page, 0, 500),
                'referrer'     => $referrer ? substr($referrer, 0, 500) : null,
                'country'      => $this->detectCountry($request),
                'country_code' => $this->detectCountryCode($request),
                'city'         => null,
                'device_type'  => $this->detectDevice($ua),
                'browser'      => $this->detectBrowser($ua),
                'os'           => $this->detectOS($ua),
                'user_agent'   => substr($ua, 0, 500),
                'is_bot'       => (bool) preg_match(self::BOT_PATTERN, $ua),
            ]);
        } catch (\Throwable) {
        }

        return response()->json(['ok' => true]);
    }

    private function fallbackSession(Request $request): string
    {
        return substr(md5($request->ip() . ($request->userAgent() ?? '') . date('Y-m-d')), 0, 32);
    }

    private function detectCountry(Request $request): ?string
    {
        $cf = $request->header('CF-IPCountry');
        if ($cf && $cf !== 'XX') {
            return $this->countryName($cf);
        }
        return $request->header('X-Country') ?? null;
    }

    private function detectCountryCode(Request $request): ?string
    {
        $cf = $request->header('CF-IPCountry');
        if ($cf && $cf !== 'XX') {
            return strtoupper($cf);
        }
        return null;
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
        ];
        return $map[$code] ?? $code;
    }

    private function detectDevice(string $ua): string
    {
        if (preg_match('/tablet|ipad|playbook|silk/i', $ua)) return 'tablet';
        if (preg_match('/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i', $ua)) return 'mobile';
        return 'desktop';
    }

    private function detectBrowser(string $ua): string
    {
        if (preg_match('/Edg\//i', $ua))         return 'Edge';
        if (preg_match('/OPR\//i', $ua))         return 'Opera';
        if (preg_match('/Chrome\//i', $ua))      return 'Chrome';
        if (preg_match('/Safari\//i', $ua))      return 'Safari';
        if (preg_match('/Firefox\//i', $ua))     return 'Firefox';
        if (preg_match('/MSIE|Trident/i', $ua))  return 'IE';
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
