<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceRequestSize
{
    private const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB

    public function handle(Request $request, Closure $next): Response
    {
        $contentLength = (int) $request->header('Content-Length', 0);

        if ($contentLength > self::MAX_BODY_BYTES) {
            return response()->json([
                'data'    => null,
                'error'   => true,
                'message' => 'Request payload too large.',
            ], 413);
        }

        return $next($request);
    }
}
