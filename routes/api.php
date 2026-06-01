<?php

use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\Admin\AdminGoogleAuthController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\UserListingController;
use App\Http\Controllers\Api\Admin\AdminAgentController;
use App\Http\Controllers\Api\Admin\AdminProfessionalApplicationController;
use App\Http\Controllers\Api\ProfessionalApplicationController;
use App\Http\Controllers\Api\AgentDashboardController;
use App\Http\Controllers\Api\UserChatController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminCityController;
use App\Http\Controllers\Api\Admin\AdminConsultController;
use App\Http\Controllers\Api\Admin\AdminFacilityController;
use App\Http\Controllers\Api\Admin\AdminFeatureController;
use App\Http\Controllers\Api\Admin\AdminInvestorController;
use App\Http\Controllers\Api\Admin\AdminProjectController;
use App\Http\Controllers\Api\Admin\AdminPropertyController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminSettingsTranslationController;
use App\Http\Controllers\Api\PublicSettingsController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\AdminAppUpdateController;
use App\Http\Controllers\Api\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\VideoStreamController;
use App\Http\Controllers\Api\PublicTranslationsController;
use App\Http\Controllers\Api\Admin\AdminTranslationController;
use App\Http\Controllers\Api\Admin\AdminContentTranslationController;
use App\Http\Controllers\Api\Admin\AdminLanguageController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\SavedSearchController;
use App\Http\Controllers\Api\TrackViewController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Dev-only: FFmpeg diagnostics ──────────────────────────────────────────
    if (app()->environment('local')) {
        Route::get('/debug-ffmpeg', function () {
            $bin = trim((string) @shell_exec('which ffmpeg 2>/dev/null'));
            if (!$bin) {
                $nixMatches = glob('/nix/store/*/bin/ffmpeg') ?: [];
                foreach ($nixMatches as $p) {
                    if (is_executable($p)) {
                        $bin = $p;
                        break;
                    }
                }
            }
            $version = $bin ? @shell_exec(escapeshellarg($bin) . ' -version 2>&1') : null;
            return response()->json([
                'ffmpeg_path' => $bin ?: 'NOT FOUND',
                'ffmpeg_version' => $version ? substr($version, 0, 200) : null,
                'exec_disabled' => in_array('exec', array_map('trim', explode(',', ini_get('disable_functions')))),
                'shell_exec_works' => function_exists('shell_exec'),
                'upload_max' => ini_get('upload_max_filesize'),
                'post_max' => ini_get('post_max_size'),
                'storage_path' => storage_path('app/public'),
                'storage_writable' => is_writable(storage_path('app/public')),
                'disable_functions' => ini_get('disable_functions') ?: 'none',
                'php_version' => PHP_VERSION,
            ]);
        });
    }

    // ── Video streaming (Range-request aware) ─────────────────────────────────
    Route::get('/stream/{path}', [VideoStreamController::class, 'stream'])->where('path', '.*');

    // ── AI endpoints — 10 req/min per IP (expensive LLM calls) ──────────────
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/ai/valuation',            [AiController::class, 'valuation']);
        Route::post('/ai/generate-description', [AiController::class, 'generateDescription']);
        Route::post('/ai/property-chat',        [AiController::class, 'propertyChat']);
        Route::post('/ai/chat',                 [AiController::class, 'generalChat']);
        Route::post('/ai/match',                [AiController::class, 'matchProperties']);
    });

    // ── Saved Searches — 10 req/min per IP ────────────────────────────────────
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/saved-searches',         [SavedSearchController::class, 'store']);
        Route::get('/saved-searches',          [SavedSearchController::class, 'index']);
        Route::delete('/saved-searches/{id}',  [SavedSearchController::class, 'destroy']);
    });

    // ── Public: Site settings (unauthenticated — for maintenance/coming-soon gate) ──
    Route::get('/public-settings', [PublicSettingsController::class, 'show']);

    // ── Public: Translation overrides (no auth — served to frontend at runtime) ──
    Route::get('/translations/{locale}', [PublicTranslationsController::class, 'show']);

    // ── Public: Languages (active only, no auth) ──────────────────────────────
    Route::get('/languages', [AdminLanguageController::class, 'publicList']);

    // ── Public: Cities (all, no property restriction) ─────────────────────────
    Route::get('/cities', [AdminCityController::class, 'publicList']);

    // ── Public: FAQs ──────────────────────────────────────────────────────────
    Route::get('/faqs', [\App\Http\Controllers\Api\FaqController::class, 'index']);

    // ── Public: Market Insights ───────────────────────────────────────────────
    Route::get('/market-insights', [\App\Http\Controllers\Api\MarketInsightsController::class, 'index']);

    // ── Public: Page view tracking ────────────────────────────────────────────
    Route::middleware('throttle:120,1')->post('/track-view', [TrackViewController::class, 'store']);

    // ── Public: Newsletter subscription ───────────────────────────────────────
    Route::post('/newsletter/subscribe',   [\App\Http\Controllers\NewsletterController::class, 'subscribe']);
    Route::post('/newsletter/unsubscribe', [\App\Http\Controllers\NewsletterController::class, 'unsubscribe']);

    // ── Public: Properties ────────────────────────────────────────────────────
    Route::get('/properties/filters', [PropertyController::class, 'filters']);
    Route::get('/properties/search', [PropertyController::class, 'search']);
    Route::get('/properties/id/{id}', [PropertyController::class, 'showById']);
    Route::get('/properties/id/{id}/similar', [PropertyController::class, 'similar']);
    Route::get('/properties/{property_id}/reviews', [ReviewController::class, 'forProperty']);
    Route::get('/properties/{slug}', [PropertyController::class, 'show']);
    Route::get('/properties', [PropertyController::class, 'index']);

    // ── Public: Projects ──────────────────────────────────────────────────────
    Route::get('/projects/filters', [ProjectController::class, 'filters']);
    Route::get('/projects/search', [ProjectController::class, 'search']);
    Route::get('/projects/id/{id}/properties', [ProjectController::class, 'properties']);
    Route::get('/projects/id/{id}', [ProjectController::class, 'showById']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);
    Route::get('/projects', [ProjectController::class, 'index']);

    // ── Public: Agents ────────────────────────────────────────────────────────
    Route::get('/agents/{id}/properties', [AgentController::class, 'properties']);
    Route::get('/agents/{id}/projects', [AgentController::class, 'projects']);
    Route::get('/agents/{id}', [AgentController::class, 'show']);
    Route::get('/agents', [AgentController::class, 'index']);

    // ── Public: Categories ────────────────────────────────────────────────────
    Route::get('/categories/filters', [CategoryController::class, 'filters']);
    Route::get('/categories/id/{id}/properties', [CategoryController::class, 'properties']);
    Route::get('/categories/id/{id}', [CategoryController::class, 'showById']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);

    // ── Public: Features ──────────────────────────────────────────────────────
    Route::get('/features/all', [FeatureController::class, 'all']);
    Route::get('/features/{id}', [FeatureController::class, 'show']);
    Route::get('/features', [FeatureController::class, 'index']);

    // ── Public: Facilities ────────────────────────────────────────────────────
    Route::get('/facilities/all', [FacilityController::class, 'all']);
    Route::get('/facilities/{id}', [FacilityController::class, 'show']);
    Route::get('/facilities', [FacilityController::class, 'index']);

    // ── Consult form — 20 req/min per IP ─────────────────────────────────────
    Route::middleware('throttle:20,1')->group(function () {
        Route::post('/consults', [ConsultController::class, 'store']);
    });
    Route::get('/consults/custom-fields', [ConsultController::class, 'customFields']);

    // ── Auth — 5 req/min per IP (brute-force prevention) ─────────────────────
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/auth/register',        [AuthController::class, 'register']);
        Route::post('/auth/login',           [AuthController::class, 'login']);
        Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/auth/reset-password',  [AuthController::class, 'resetPassword']);
        Route::post('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail']);
    });
    Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
    Route::get('/admin/auth/google', [AdminGoogleAuthController::class, 'redirect']);
    Route::get('/admin/auth/google/callback', [AdminGoogleAuthController::class, 'callback']);

    // ── Protected: Account — 100 req/min per IP ───────────────────────────────
    Route::middleware(['auth:sanctum', 'throttle:100,1'])->group(function () {
        Route::get('/account/profile', [AuthController::class, 'profile']);
        Route::put('/account/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/resend-verification', [AuthController::class, 'resendVerification']);
        Route::post('/properties/{property_id}/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{id}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

        // User property listings
        Route::get('/account/my-listings', [UserListingController::class, 'index']);
        Route::post('/account/listings', [UserListingController::class, 'store']);

        // Professional applications
        Route::get('/account/professional-status', [ProfessionalApplicationController::class, 'status']);
        Route::post('/account/professional-apply', [ProfessionalApplicationController::class, 'apply']);

        // Agent dashboard (approved professionals only)
        Route::get('/account/agent/overview', [AgentDashboardController::class, 'overview']);
        Route::get('/account/agent/properties', [AgentDashboardController::class, 'properties']);
        Route::put('/account/agent/properties/{id}', [AgentDashboardController::class, 'updateProperty']);
        Route::get('/account/agent/projects', [AgentDashboardController::class, 'projects']);
        Route::put('/account/agent/projects/{id}', [AgentDashboardController::class, 'updateProject']);
        Route::get('/account/agent/messages', [AgentDashboardController::class, 'messages']);
        Route::get('/account/agent/messages/{id}', [AgentDashboardController::class, 'getThread']);
        Route::post('/account/agent/messages/{id}/reply', [AgentDashboardController::class, 'replyToMessage']);
        Route::put('/account/agent/profile', [AgentDashboardController::class, 'updateProfile']);
        Route::post('/account/agent/avatar', [AgentDashboardController::class, 'uploadAvatar']);
        Route::post('/account/agent/avatar/preset', [AgentDashboardController::class, 'setPresetAvatar']);

        // Favorites
        Route::get('/account/chats', [UserChatController::class, 'index']);
        Route::post('/account/chats/start', [UserChatController::class, 'startChat']);
        Route::get('/account/chats/{id}', [UserChatController::class, 'getThread']);
        Route::post('/account/chats/{id}/message', [UserChatController::class, 'sendMessage']);

        Route::get('/account/favorites/ids', [FavoriteController::class, 'ids']);
        Route::get('/account/favorites', [FavoriteController::class, 'index']);
        Route::post('/account/favorites/{property_id}', [FavoriteController::class, 'toggle']);
    });

    // ── Admin: Media (no Sanctum for upload — proxied through Vite in dev)
    Route::prefix('admin')->group(function () {
        Route::post('/media/upload', [MediaController::class, 'upload']);
        Route::delete('/media/path', [MediaController::class, 'deleteByPath']);
    });

    // ── Admin (Sanctum protected) — 60 req/min per user ──────────────────────
    Route::prefix('admin')->middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        Route::get('/stats', [AdminStatsController::class, 'index']);

        Route::apiResource('properties', AdminPropertyController::class);
        Route::put('/properties/{id}/moderation', [AdminPropertyController::class, 'moderation']);
        Route::apiResource('projects', AdminProjectController::class);
        Route::apiResource('agents', AdminAgentController::class);
        Route::post('/agents/{id}/ban', [AdminAgentController::class, 'ban']);
        Route::post('/agents/{id}/unban', [AdminAgentController::class, 'unban']);
        Route::get('/professional-applications', [AdminProfessionalApplicationController::class, 'index']);
        Route::post('/professional-applications/{id}/approve', [AdminProfessionalApplicationController::class, 'approve']);
        Route::post('/professional-applications/{id}/reject', [AdminProfessionalApplicationController::class, 'reject']);
        Route::apiResource('categories', AdminCategoryController::class);
        Route::apiResource('features', AdminFeatureController::class);
        Route::apiResource('facilities', AdminFacilityController::class);
        Route::apiResource('investors', AdminInvestorController::class);
        Route::apiResource('cities', AdminCityController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('users', AdminUserController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::post('/users/{id}/ban', [AdminUserController::class, 'ban']);
        Route::post('/users/{id}/unban', [AdminUserController::class, 'unban']);

        // Media library
        Route::get('/media', [MediaController::class, 'index']);

        Route::post('/media/{id}/thumbnail', [MediaController::class, 'rethumbnail']);
        Route::post('/media/thumbnail/batch', [MediaController::class, 'batchRethumbnail']);
        Route::delete('/media/{id}', [MediaController::class, 'destroy']);

        // FAQs
        Route::get('/faqs', [\App\Http\Controllers\Api\Admin\AdminFaqController::class, 'index']);
        Route::post('/faqs', [\App\Http\Controllers\Api\Admin\AdminFaqController::class, 'store']);
        Route::put('/faqs/{id}', [\App\Http\Controllers\Api\Admin\AdminFaqController::class, 'update']);
        Route::delete('/faqs/{id}', [\App\Http\Controllers\Api\Admin\AdminFaqController::class, 'destroy']);
        Route::post('/faqs/bulk-delete', [\App\Http\Controllers\Api\Admin\AdminFaqController::class, 'bulkDelete']);

        // Consults
        Route::get('/consults', [AdminConsultController::class, 'index']);
        Route::put('/consults/{id}', [AdminConsultController::class, 'update']);
        Route::delete('/consults/{id}', [AdminConsultController::class, 'destroy']);
        Route::post('/consults/bulk', [AdminConsultController::class, 'bulkUpdate']);
        Route::post('/consults/bulk-delete', [AdminConsultController::class, 'bulkDelete']);

        // Languages CRUD
        Route::apiResource('languages', AdminLanguageController::class)->only(['index', 'store', 'update', 'destroy']);

        // Content translations (per-item, per-locale)
        Route::get('/content-translations/{type}/{id}',    [AdminContentTranslationController::class, 'index']);
        Route::put('/content-translations/{type}/{id}',    [AdminContentTranslationController::class, 'upsert']);
        Route::delete('/content-translations/{type}/{id}', [AdminContentTranslationController::class, 'destroy']);

        // Translations
        Route::get('/translations', [AdminTranslationController::class, 'index']);
        Route::put('/translations/{locale}/{key}', [AdminTranslationController::class, 'upsert'])->where('key', '.+');
        Route::delete('/translations/{locale}/{key}', [AdminTranslationController::class, 'destroy'])->where('key', '.+');

        // Settings
        Route::get('/settings', [AdminSettingsController::class, 'show']);
        Route::put('/settings', [AdminSettingsController::class, 'update']);
        Route::post('/settings/logo', [AdminSettingsController::class, 'uploadLogo']);
        Route::post('/settings/hero-bg', [AdminSettingsController::class, 'uploadHeroBg']);
        Route::post('/settings/og-image', [AdminSettingsController::class, 'uploadOgImage']);
        Route::post('/settings/mail-test', [AdminSettingsController::class, 'testMail']);
        Route::post('/settings/sitemap-ping', [AdminSettingsController::class, 'sitemapPing']);
        Route::post('/settings/prerender-recache', [AdminSettingsController::class, 'prerenderRecache']);
        Route::post('/settings/auto-translate', [AdminSettingsController::class, 'autoTranslate']);

        // Translatable settings (per-locale overrides)
        Route::get('/settings/translations/{locale}', [AdminSettingsTranslationController::class, 'show']);
        Route::put('/settings/translations/{locale}', [AdminSettingsTranslationController::class, 'update']);
        Route::delete('/settings/translations/{locale}/{key}', [AdminSettingsTranslationController::class, 'destroy'])->where('key', '.+');

        // App Update Manager
        Route::get('/app-update/history', [AdminAppUpdateController::class, 'history']);
        Route::post('/app-update/upload', [AdminAppUpdateController::class, 'upload']);
        Route::delete('/app-update/history/{id}', [AdminAppUpdateController::class, 'deleteHistory']);

        // Analytics
        Route::prefix('analytics')->group(function () {
            Route::get('/overview',       [AdminAnalyticsController::class, 'overview']);
            Route::get('/time-series',    [AdminAnalyticsController::class, 'timeSeries']);
            Route::get('/top-pages',      [AdminAnalyticsController::class, 'topPages']);
            Route::get('/countries',      [AdminAnalyticsController::class, 'countries']);
            Route::get('/devices',        [AdminAnalyticsController::class, 'devices']);
            Route::get('/browsers',       [AdminAnalyticsController::class, 'browsers']);
            Route::get('/os',             [AdminAnalyticsController::class, 'os']);
            Route::get('/recent',         [AdminAnalyticsController::class, 'recentVisitors']);
            Route::get('/live',           [AdminAnalyticsController::class, 'liveVisitors']);
        });
    });
});
