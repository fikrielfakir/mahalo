<?php

use App\Http\Controllers\Api\AgentController;
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
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminCityController;
use App\Http\Controllers\Api\Admin\AdminConsultController;
use App\Http\Controllers\Api\Admin\AdminFacilityController;
use App\Http\Controllers\Api\Admin\AdminFeatureController;
use App\Http\Controllers\Api\Admin\AdminInvestorController;
use App\Http\Controllers\Api\Admin\AdminProjectController;
use App\Http\Controllers\Api\Admin\AdminPropertyController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\MediaController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Public: Properties ────────────────────────────────────────────────────
    Route::get('/properties/filters',              [PropertyController::class, 'filters']);
    Route::get('/properties/search',               [PropertyController::class, 'search']);
    Route::get('/properties/id/{id}',              [PropertyController::class, 'showById']);
    Route::get('/properties/{property_id}/reviews',[ReviewController::class,  'forProperty']);
    Route::get('/properties/{slug}',               [PropertyController::class, 'show']);
    Route::get('/properties',                      [PropertyController::class, 'index']);

    // ── Public: Projects ──────────────────────────────────────────────────────
    Route::get('/projects/filters',                [ProjectController::class, 'filters']);
    Route::get('/projects/search',                 [ProjectController::class, 'search']);
    Route::get('/projects/id/{id}/properties',     [ProjectController::class, 'properties']);
    Route::get('/projects/id/{id}',                [ProjectController::class, 'showById']);
    Route::get('/projects/{slug}',                 [ProjectController::class, 'show']);
    Route::get('/projects',                        [ProjectController::class, 'index']);

    // ── Public: Agents ────────────────────────────────────────────────────────
    Route::get('/agents/{id}/properties',          [AgentController::class, 'properties']);
    Route::get('/agents/{id}/projects',            [AgentController::class, 'projects']);
    Route::get('/agents/{id}',                     [AgentController::class, 'show']);
    Route::get('/agents',                          [AgentController::class, 'index']);

    // ── Public: Categories ────────────────────────────────────────────────────
    Route::get('/categories/filters',              [CategoryController::class, 'filters']);
    Route::get('/categories/id/{id}/properties',   [CategoryController::class, 'properties']);
    Route::get('/categories/id/{id}',              [CategoryController::class, 'showById']);
    Route::get('/categories/{slug}',               [CategoryController::class, 'show']);
    Route::get('/categories',                      [CategoryController::class, 'index']);

    // ── Public: Features ──────────────────────────────────────────────────────
    Route::get('/features/all',                    [FeatureController::class, 'all']);
    Route::get('/features/{id}',                   [FeatureController::class, 'show']);
    Route::get('/features',                        [FeatureController::class, 'index']);

    // ── Public: Facilities ────────────────────────────────────────────────────
    Route::get('/facilities/all',                  [FacilityController::class, 'all']);
    Route::get('/facilities/{id}',                 [FacilityController::class, 'show']);
    Route::get('/facilities',                      [FacilityController::class, 'index']);

    // ── Public: Consults & Auth ───────────────────────────────────────────────
    Route::post('/consults',                       [ConsultController::class, 'store']);
    Route::get('/consults/custom-fields',          [ConsultController::class, 'customFields']);
    Route::post('/auth/register',                  [AuthController::class, 'register']);
    Route::post('/auth/login',                     [AuthController::class, 'login']);
    Route::post('/auth/forgot-password',           [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password',            [AuthController::class, 'resetPassword']);
    Route::post('/auth/verify-email/{id}/{hash}',  [AuthController::class, 'verifyEmail']);

    // ── Protected: Account ────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/account/profile',                        [AuthController::class, 'profile']);
        Route::put('/account/profile',                        [AuthController::class, 'updateProfile']);
        Route::post('/auth/logout',                           [AuthController::class, 'logout']);
        Route::post('/auth/resend-verification',              [AuthController::class, 'resendVerification']);
        Route::post('/properties/{property_id}/reviews',      [ReviewController::class, 'store']);
        Route::put('/reviews/{id}',                           [ReviewController::class, 'update']);
        Route::delete('/reviews/{id}',                        [ReviewController::class, 'destroy']);

        // User property listings
        Route::get('/account/my-listings',  [UserListingController::class, 'index']);
        Route::post('/account/listings',    [UserListingController::class, 'store']);

        // Favorites
        Route::get('/account/favorites/ids',       [FavoriteController::class, 'ids']);
        Route::get('/account/favorites',            [FavoriteController::class, 'index']);
        Route::post('/account/favorites/{property_id}', [FavoriteController::class, 'toggle']);
    });

    // ── Admin: Media (no Sanctum for upload — proxied through Vite in dev)
    Route::prefix('admin')->group(function () {
        Route::post('/media',        [MediaController::class, 'upload']);
        Route::post('/media/upload', [MediaController::class, 'upload']);
        Route::delete('/media/path', [MediaController::class, 'deleteByPath']);
    });

    // ── Admin (Sanctum protected) ─────────────────────────────────────────────
    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
        Route::get('/stats',                  [AdminStatsController::class,   'index']);

        Route::apiResource('properties',      AdminPropertyController::class);
        Route::put('/properties/{id}/moderation', [AdminPropertyController::class, 'moderation']);
        Route::apiResource('projects',        AdminProjectController::class);
        Route::apiResource('agents',          AdminAgentController::class);
        Route::apiResource('categories',      AdminCategoryController::class);
        Route::apiResource('features',        AdminFeatureController::class);
        Route::apiResource('facilities',      AdminFacilityController::class);
        Route::apiResource('investors',       AdminInvestorController::class);
        Route::apiResource('cities',          AdminCityController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('users',           AdminUserController::class)->only(['index', 'store', 'update', 'destroy']);

        // Media library
        Route::get('/media',              [MediaController::class, 'index']);
        Route::delete('/media/{id}',      [MediaController::class, 'destroy']);

        // Consults
        Route::get('/consults',           [AdminConsultController::class, 'index']);
        Route::put('/consults/{id}',      [AdminConsultController::class, 'update']);
        Route::delete('/consults/{id}',   [AdminConsultController::class, 'destroy']);
        Route::post('/consults/bulk',          [AdminConsultController::class, 'bulkUpdate']);
        Route::post('/consults/bulk-delete',   [AdminConsultController::class, 'bulkDelete']);

        // Settings
        Route::get('/settings',             [AdminSettingsController::class, 'show']);
        Route::put('/settings',             [AdminSettingsController::class, 'update']);
        Route::post('/settings/logo',       [AdminSettingsController::class, 'uploadLogo']);
        Route::post('/settings/mail-test',  [AdminSettingsController::class, 'testMail']);
    });
});
