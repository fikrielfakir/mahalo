<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PublicTranslationsController extends Controller
{
    private const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar'];

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

    private function unflatten(array $flat): array
    {
        $result = [];
        foreach ($flat as $key => $value) {
            $parts = explode('.', $key);
            $ref   = &$result;
            foreach ($parts as $part) {
                if (!isset($ref[$part]) || !is_array($ref[$part])) {
                    $ref[$part] = [];
                }
                $ref = &$ref[$part];
            }
            $ref = $value;
            unset($ref);
        }
        return $result;
    }

    public function show(string $locale): JsonResponse
    {
        if (!in_array($locale, self::SUPPORTED_LOCALES)) {
            return response()->json(['error' => true, 'message' => 'Unsupported locale'], 422);
        }

        $path = base_path("frontend/src/locales/{$locale}/common.json");
        $bundled = [];
        if (file_exists($path)) {
            $bundled = $this->flatten(json_decode(file_get_contents($path), true) ?? []);
        }

        $overrides = DB::table('translation_overrides')
            ->where('locale', $locale)
            ->pluck('value', 'key')
            ->toArray();

        $merged = array_merge($bundled, $overrides);

        return response()->json([
            'data'    => $this->unflatten($merged),
            'error'   => false,
            'message' => null,
        ]);
    }
}
