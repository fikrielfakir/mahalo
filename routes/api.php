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
use App\Http\Controllers\Api\Admin\AdminAgentController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminConsultController;
use App\Http\Controllers\Api\Admin\AdminFacilityController;
use App\Http\Controllers\Api\Admin\AdminFeatureController;
use App\Http\Controllers\Api\Admin\AdminInvestorController;
use App\Http\Controllers\Api\Admin\AdminProjectController;
use App\Http\Controllers\Api\Admin\AdminPropertyController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Public: Properties ────────────────────────────────────────────────────
    Route::get('/properties/filters',             [PropertyController::class, 'filters']);
    Route::get('/properties/search',              [PropertyController::class, 'search']);
    Route::get('/properties/id/{id}',             [PropertyController::class, 'showById']);
    Route::get('/properties/{property_id}/reviews',[ReviewController::class,  'forProperty']);
    Route::get('/properties/{slug}',              [PropertyController::class, 'show']);
    Route::get('/properties',                     [PropertyController::class, 'index']);

    // ── Public: Projects ──────────────────────────────────────────────────────
    Route::get('/projects/filters',               [ProjectController::class, 'filters']);
    Route::get('/projects/search',                [ProjectController::class, 'search']);
    Route::get('/projects/id/{id}/properties',    [ProjectController::class, 'properties']);
    Route::get('/projects/id/{id}',               [ProjectController::class, 'showById']);
    Route::get('/projects/{slug}',                [ProjectController::class, 'show']);
    Route::get('/projects',                       [ProjectController::class, 'index']);

    // ── Public: Agents ────────────────────────────────────────────────────────
    Route::get('/agents/{id}/properties',         [AgentController::class, 'properties']);
    Route::get('/agents/{id}/projects',           [AgentController::class, 'projects']);
    Route::get('/agents/{id}',                    [AgentController::class, 'show']);
    Route::get('/agents',                         [AgentController::class, 'index']);

    // ── Public: Categories ────────────────────────────────────────────────────
    Route::get('/categories/filters',             [CategoryController::class, 'filters']);
    Route::get('/categories/id/{id}/properties',  [CategoryController::class, 'properties']);
    Route::get('/categories/id/{id}',             [CategoryController::class, 'showById']);
    Route::get('/categories/{slug}',              [CategoryController::class, 'show']);
    Route::get('/categories',                     [CategoryController::class, 'index']);

    // ── Public: Features ──────────────────────────────────────────────────────
    Route::get('/features/all',                   [FeatureController::class, 'all']);
    Route::get('/features/{id}',                  [FeatureController::class, 'show']);
    Route::get('/features',                       [FeatureController::class, 'index']);

    // ── Public: Facilities ────────────────────────────────────────────────────
    Route::get('/facilities/all',                 [FacilityController::class, 'all']);
    Route::get('/facilities/{id}',                [FacilityController::class, 'show']);
    Route::get('/facilities',                     [FacilityController::class, 'index']);

    // ── Public: Consults & Auth ───────────────────────────────────────────────
    Route::post('/consults',                      [ConsultController::class, 'store']);
    Route::get('/consults/custom-fields',         [ConsultController::class, 'customFields']);
    Route::post('/auth/login',                    [AuthController::class, 'login']);

    // ── Protected: Account ────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/account/profile',                        [AuthController::class, 'profile']);
        Route::post('/auth/logout',                           [AuthController::class, 'logout']);
        Route::post('/properties/{property_id}/reviews',      [ReviewController::class, 'store']);
        Route::put('/reviews/{id}',                           [ReviewController::class, 'update']);
        Route::delete('/reviews/{id}',                        [ReviewController::class, 'destroy']);
    });

    // ── Admin (Sanctum protected) ─────────────────────────────────────────────
    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
        Route::get('/stats',                  [AdminStatsController::class,   'index']);

        Route::apiResource('properties',      AdminPropertyController::class);
        Route::apiResource('projects',        AdminProjectController::class);
        Route::apiResource('agents',          AdminAgentController::class);
        Route::apiResource('categories',      AdminCategoryController::class);
        Route::apiResource('features',        AdminFeatureController::class);
        Route::apiResource('facilities',      AdminFacilityController::class);
        Route::apiResource('investors',       AdminInvestorController::class);

        Route::get('/consults',               [AdminConsultController::class, 'index']);
        Route::put('/consults/{id}',          [AdminConsultController::class, 'update']);
        Route::delete('/consults/{id}',       [AdminConsultController::class, 'destroy']);
    });
});
