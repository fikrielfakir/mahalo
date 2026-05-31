<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Homzen Real Estate API', 'version' => '1.0']);
});

// Serve public/og-image.png — real image file copied here on every admin upload.
// Both /og-image and /og-image.png are handled so either URL works for bots.
$ogImageHandler = function () {
    $file = public_path('og-image.png');
    if (file_exists($file)) {
        return response()->file($file, ['Content-Type' => 'image/png', 'Cache-Control' => 'public, max-age=3600']);
    }
    // Fallback: 1×1 transparent GIF so the tag is never a broken link
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
