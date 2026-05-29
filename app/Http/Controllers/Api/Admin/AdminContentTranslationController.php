<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentTranslation;
use Illuminate\Http\Request;

class AdminContentTranslationController extends Controller
{
    private const ALLOWED_TYPES = [
        'property', 'project', 'agent', 'category',
        'feature', 'facility', 'investor', 'city', 'faq',
    ];

    private const TYPE_FIELDS = [
        'property'  => ['name', 'description', 'content'],
        'project'   => ['name', 'description', 'content'],
        'agent'     => ['description'],
        'category'  => ['name', 'description'],
        'feature'   => ['name'],
        'facility'  => ['name'],
        'investor'  => ['name'],
        'city'      => ['name'],
        'faq'       => ['question', 'answer'],
    ];

    private const ALLOWED_LOCALES = ['fr', 'en', 'ar', 'es', 'tr', 'id', 'vi'];

    public function index(string $type, int $id)
    {
        if (!in_array($type, self::ALLOWED_TYPES)) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Invalid type'], 422);
        }

        $rows = ContentTranslation::where('translatable_type', $type)
            ->where('translatable_id', $id)
            ->get();

        $result = [];
        foreach (self::ALLOWED_LOCALES as $locale) {
            $result[$locale] = [];
            foreach (self::TYPE_FIELDS[$type] as $field) {
                $row = $rows->where('locale', $locale)->where('field', $field)->first();
                $result[$locale][$field] = $row ? $row->value : '';
            }
        }

        return response()->json(['data' => $result, 'error' => false, 'message' => null]);
    }

    public function upsert(Request $request, string $type, int $id)
    {
        if (!in_array($type, self::ALLOWED_TYPES)) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Invalid type'], 422);
        }

        $locale = $request->input('locale');
        if (!in_array($locale, self::ALLOWED_LOCALES)) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Invalid locale'], 422);
        }

        $translations = $request->input('translations', []);
        $allowedFields = self::TYPE_FIELDS[$type];

        foreach ($allowedFields as $field) {
            if (!array_key_exists($field, $translations)) {
                continue;
            }

            $value = $translations[$field];

            ContentTranslation::updateOrCreate(
                [
                    'translatable_type' => $type,
                    'translatable_id'   => $id,
                    'locale'            => $locale,
                    'field'             => $field,
                ],
                ['value' => $value ?: null]
            );
        }

        return response()->json(['data' => null, 'error' => false, 'message' => 'Saved']);
    }

    public function destroy(string $type, int $id)
    {
        if (!in_array($type, self::ALLOWED_TYPES)) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Invalid type'], 422);
        }

        ContentTranslation::where('translatable_type', $type)
            ->where('translatable_id', $id)
            ->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'Deleted']);
    }
}
