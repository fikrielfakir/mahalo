<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Homzen Real Estate API', 'version' => '1.0']);
});

// Canonical OG image endpoint. Always streams the currently configured image
// from the admin (stored in site_settings.og_image_url), so bots always get
// the right image regardless of what's in the static public folder.
$ogImageHandler = function () {
    $storedUrl = DB::table('site_settings')->where('key', 'og_image_url')->value('value');

    if ($storedUrl) {
        // Derive the absolute filesystem path from the stored URL.
        // Stored as: https://example.com/storage/og/uuid.ext
        $parsed = parse_url($storedUrl);
        $urlPath = $parsed['path'] ?? '';

        // Strip the /storage/ prefix to get the relative storage path.
        if (str_starts_with($urlPath, '/storage/')) {
            $relativePath = ltrim(substr($urlPath, strlen('/storage/')), '/');
            $absolutePath = storage_path('app/public/' . $relativePath);

            if (file_exists($absolutePath)) {
                $ext = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));
                $mime = match ($ext) {
                    'jpg', 'jpeg' => 'image/jpeg',
                    'webp'        => 'image/webp',
                    default       => 'image/png',
                };
                return response()->file($absolutePath, [
                    'Content-Type'  => $mime,
                    'Cache-Control' => 'public, max-age=300',
                ]);
            }
        }
    }

    // Fallback: serve the static public/og-image.png placeholder.
    $fallback = public_path('og-image.png');
    if (file_exists($fallback)) {
        return response()->file($fallback, ['Content-Type' => 'image/png', 'Cache-Control' => 'public, max-age=300']);
    }

    // Last resort: 1×1 transparent GIF so the tag is never a broken link.
    return response(base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), 200)
        ->header('Content-Type', 'image/gif')
        ->header('Cache-Control', 'no-cache');
};
Route::get('/og-image',     $ogImageHandler);
Route::get('/og-image.png', $ogImageHandler);

Route::get('/sitemap.xml',              [SitemapController::class, 'index']);
Route::get('/sitemap-static.xml',       [SitemapController::class, 'staticPages']);
Route::get('/sitemap-properties.xml',   [SitemapController::class, 'properties']);
Route::get('/sitemap-projects.xml',     [SitemapController::class, 'projects']);
Route::get('/sitemap-agents.xml',       [SitemapController::class, 'agents']);
Route::get('/sitemap-ping',             [SitemapController::class, 'ping']);
