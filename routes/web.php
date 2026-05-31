<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Homzen Real Estate API', 'version' => '1.0']);
});

// Stable canonical OG image URL — bots always hit this; it redirects to the
// currently configured image so the URL in og:image never needs to change.
Route::get('/og-image', function () {
    $url = DB::table('site_settings')->where('key', 'og_image_url')->value('value');
    if ($url) {
        return redirect()->away($url, 301);
    }
    // Fallback: 1×1 transparent GIF so the tag is always valid
    return response(base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), 200)
        ->header('Content-Type', 'image/gif')
        ->header('Cache-Control', 'no-cache');
});

Route::get('/sitemap.xml',              [SitemapController::class, 'index']);
Route::get('/sitemap-static.xml',       [SitemapController::class, 'staticPages']);
Route::get('/sitemap-properties.xml',   [SitemapController::class, 'properties']);
Route::get('/sitemap-projects.xml',     [SitemapController::class, 'projects']);
Route::get('/sitemap-agents.xml',       [SitemapController::class, 'agents']);
Route::get('/sitemap-ping',             [SitemapController::class, 'ping']);
