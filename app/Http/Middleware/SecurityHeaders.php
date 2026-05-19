<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options',    'nosniff');
        $response->headers->set('X-Frame-Options',           'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection',          '1; mode=block');
        $response->headers->set('Referrer-Policy',            'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy',         'camera=(), microphone=(), geolocation=(self)');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');

        if ($request->secure() || app()->environment('production')) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        // These are set by PHP/web server — must use native PHP to suppress them
        @header_remove('X-Powered-By');
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
