<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class DDoSProtection
{
    private const BAN_KEY_PREFIX   = 'ddos_ban:';
    private const COUNT_KEY_PREFIX = 'ddos_req:';

    private const WINDOW_SECONDS   = 60;
    private const WINDOW_LIMIT     = 300;

    private const BURST_WINDOW     = 10;
    private const BURST_LIMIT      = 80;

    private const BAN_MINUTES_SOFT = 5;
    private const BAN_MINUTES_HARD = 30;

    private const SAFE_PATHS = [
        'api/v1/public-settings',
        'api/v1/languages',
        'api/v1/translations/*',
        'up',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip() ?? '0.0.0.0';

        foreach (self::SAFE_PATHS as $path) {
            if ($request->is($path)) {
                return $next($request);
            }
        }

        $banKey = self::BAN_KEY_PREFIX . $ip;
        if ($ban = Cache::get($banKey)) {
            return $this->bannedResponse($ban['until']);
        }

        $burstSlot  = (int) (time() / self::BURST_WINDOW);
        $windowSlot = (int) (time() / self::WINDOW_SECONDS);

        $burstKey  = self::COUNT_KEY_PREFIX . 'burst:'  . $ip . ':' . $burstSlot;
        $windowKey = self::COUNT_KEY_PREFIX . 'window:' . $ip . ':' . $windowSlot;

        // Cache::add() sets the key with a TTL only if it doesn't already exist.
        // Then increment() bumps the counter. This is safe on file/array/redis drivers.
        Cache::add($burstKey,  0, self::BURST_WINDOW  + 5);
        Cache::add($windowKey, 0, self::WINDOW_SECONDS + 5);

        $burst  = Cache::increment($burstKey);
        $window = Cache::increment($windowKey);

        if ($burst > self::BURST_LIMIT) {
            $until = now()->addMinutes(self::BAN_MINUTES_SOFT)->toIso8601String();
            Cache::put($banKey, ['until' => $until, 'reason' => 'burst'], self::BAN_MINUTES_SOFT * 60);
            return $this->bannedResponse($until);
        }

        if ($window > self::WINDOW_LIMIT) {
            $until = now()->addMinutes(self::BAN_MINUTES_HARD)->toIso8601String();
            Cache::put($banKey, ['until' => $until, 'reason' => 'sustained'], self::BAN_MINUTES_HARD * 60);
            return $this->bannedResponse($until);
        }

        $response = $next($request);

        $response->headers->set('X-RateLimit-Remaining-Window', (string) max(0, self::WINDOW_LIMIT - $window));
        $response->headers->set('X-RateLimit-Remaining-Burst',  (string) max(0, self::BURST_LIMIT  - $burst));

        return $response;
    }

    private function bannedResponse(string $until): Response
    {
        return response()->json([
            'data'        => null,
            'error'       => true,
            'message'     => 'Too many requests. Your IP has been temporarily blocked.',
            'retry_after' => $until,
        ], 429)->withHeaders([
            'Retry-After'    => 300,
            'X-Blocked-Until' => $until,
        ]);
    }
}
