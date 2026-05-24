<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminSettingsTranslationController extends Controller
{
    private const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar'];

    private const TRANSLATABLE_KEYS = [
        'footer_description',
        'tagline',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'maintenance_message',
        'coming_soon_message',
        'cookie_consent_title',
        'cookie_consent_message',
        'cookie_accept_text',
        'cookie_decline_text',
        'page_about',
        'page_privacy',
        'page_terms',
        'mobile_app_title',
        'mobile_app_subtitle',
        'mobile_app_description',
    ];

    public function show(Request $request, string $locale): JsonResponse
    {
        if (!in_array($locale, self::SUPPORTED_LOCALES)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        // Get base defaults from site_settings
        $baseRows = DB::table('site_settings')
            ->whereIn('key', self::TRANSLATABLE_KEYS)
            ->pluck('value', 'key')
            ->toArray();

        // Get locale-specific overrides
        $overrides = DB::table('site_settings_translations')
            ->where('locale', $locale)
            ->whereIn('key', self::TRANSLATABLE_KEYS)
            ->pluck('value', 'key')
            ->toArray();

        $result = [];
        foreach (self::TRANSLATABLE_KEYS as $key) {
            $result[$key] = [
                'value'      => $overrides[$key] ?? null,
                'default'    => $baseRows[$key] ?? null,
                'overridden' => isset($overrides[$key]),
            ];
        }

        return response()->json([
            'data'    => $result,
            'locale'  => $locale,
            'error'   => false,
            'message' => null,
        ]);
    }

    public function update(Request $request, string $locale): JsonResponse
    {
        if (!in_array($locale, self::SUPPORTED_LOCALES)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        $data = $request->only(self::TRANSLATABLE_KEYS);

        foreach ($data as $key => $value) {
            if ($value === null || $value === '') {
                // Delete override if value is empty (fall back to default)
                DB::table('site_settings_translations')
                    ->where('locale', $locale)
                    ->where('key', $key)
                    ->delete();
            } else {
                DB::table('site_settings_translations')->upsert(
                    [
                        'locale'     => $locale,
                        'key'        => $key,
                        'value'      => $value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    ['locale', 'key'],
                    ['value', 'updated_at']
                );
            }
        }

        return response()->json([
            'data'    => null,
            'error'   => false,
            'message' => 'Translations saved.',
        ]);
    }

    public function destroy(string $locale, string $key): JsonResponse
    {
        if (!in_array($locale, self::SUPPORTED_LOCALES)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        DB::table('site_settings_translations')
            ->where('locale', $locale)
            ->where('key', $key)
            ->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => null]);
    }
}
