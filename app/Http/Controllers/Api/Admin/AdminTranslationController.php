<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTranslationController extends Controller
{
    private function getSupportedLocales(): array
    {
        return DB::table('languages')->pluck('code')->toArray();
    }

    private function loadBundled(string $locale): array
    {
        $path = base_path("frontend/src/locales/{$locale}/common.json");
        if (!file_exists($path)) return [];
        $data = json_decode(file_get_contents($path), true) ?? [];
        return $this->flatten($data);
    }

    private function flatten(array $data, string $prefix = ''): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            $fullKey = $prefix ? "{$prefix}.{$key}" : $key;
            if (is_array($value)) {
                $result = array_merge($result, $this->flatten($value, $fullKey));
            } else {
                $result[$fullKey] = (string) $value;
            }
        }
        return $result;
    }

    public function index(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'fr');
        $supported = $this->getSupportedLocales();
        if (!in_array($locale, $supported)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        $bundled  = $this->loadBundled($locale);
        $overrides = DB::table('translation_overrides')
            ->where('locale', $locale)
            ->pluck('value', 'key')
            ->toArray();

        $rows = [];
        foreach ($bundled as $key => $default) {
            $rows[] = [
                'key'        => $key,
                'value'      => $overrides[$key] ?? $default,
                'default'    => $default,
                'overridden' => isset($overrides[$key]),
            ];
        }

        usort($rows, fn($a, $b) => strcmp($a['key'], $b['key']));

        return response()->json(['data' => $rows, 'error' => false, 'message' => null]);
    }

    public function upsert(Request $request, string $locale, string $key): JsonResponse
    {
        $supported = $this->getSupportedLocales();
        if (!in_array($locale, $supported)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        $value = $request->input('value', '');

        DB::table('translation_overrides')->upsert(
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

        return response()->json(['data' => compact('locale', 'key', 'value'), 'error' => false, 'message' => null]);
    }

    public function destroy(string $locale, string $key): JsonResponse
    {
        $supported = $this->getSupportedLocales();
        if (!in_array($locale, $supported)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        DB::table('translation_overrides')
            ->where('locale', $locale)
            ->where('key', $key)
            ->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => null]);
    }
}
