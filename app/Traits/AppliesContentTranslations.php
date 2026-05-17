<?php

namespace App\Traits;

use App\Models\ContentTranslation;
use Illuminate\Http\Request;

trait AppliesContentTranslations
{
    protected function resolveLocale(Request $request): string
    {
        $allowed = ['fr', 'en', 'ar', 'es', 'tr', 'id', 'vi'];

        $header = $request->header('Accept-Language', 'fr');
        $raw    = strtolower(trim(explode(',', $header)[0]));
        $locale = explode('-', explode(';', $raw)[0])[0];

        return in_array($locale, $allowed) ? $locale : 'fr';
    }

    protected function overlayTranslations(array $data, string $type, int $id, string $locale, array $fields): array
    {
        if (empty($locale) || $locale === 'fr') {
            return $data;
        }

        $rows = ContentTranslation::where('translatable_type', $type)
            ->where('translatable_id', $id)
            ->where('locale', $locale)
            ->whereIn('field', $fields)
            ->get();

        foreach ($rows as $row) {
            if (!empty($row->value) && array_key_exists($row->field, $data)) {
                $data[$row->field] = $row->value;
            }
        }

        return $data;
    }
}
