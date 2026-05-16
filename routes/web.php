<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Homzen Real Estate API', 'version' => '1.0']);
});

Route::get('/sitemap.xml',              [SitemapController::class, 'index']);
Route::get('/sitemap-static.xml',       [SitemapController::class, 'staticPages']);
Route::get('/sitemap-properties.xml',   [SitemapController::class, 'properties']);
Route::get('/sitemap-projects.xml',     [SitemapController::class, 'projects']);
Route::get('/sitemap-agents.xml',       [SitemapController::class, 'agents']);
Route::get('/sitemap-ping',             [SitemapController::class, 'ping']);
