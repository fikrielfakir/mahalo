<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentTranslation;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    private const SUPPORTED_LOCALES = ['fr', 'en', 'ar', 'es', 'tr', 'id', 'vi'];

    public function index(Request $request): JsonResponse
    {
        $faqs = Faq::where('is_active', true)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'category', 'question', 'answer']);

        // Apply locale translations if requested
        $locale = $this->resolveLocale($request);

        if ($locale) {
            $ids = $faqs->pluck('id')->toArray();

            $translations = ContentTranslation::where('translatable_type', 'faq')
                ->whereIn('translatable_id', $ids)
                ->where('locale', $locale)
                ->whereIn('field', ['question', 'answer'])
                ->get()
                ->groupBy('translatable_id');

            $faqs = $faqs->map(function ($faq) use ($translations) {
                $row = $translations->get($faq->id, collect());
                $q   = $row->firstWhere('field', 'question')?->value;
                $a   = $row->firstWhere('field', 'answer')?->value;
                return [
                    'id'       => $faq->id,
                    'category' => $faq->category,
                    'question' => ($q && trim($q)) ? $q : $faq->question,
                    'answer'   => ($a && trim($a)) ? $a : $faq->answer,
                ];
            });
        }

        // Group by category
        $grouped = $faqs->groupBy('category')->map(fn($items) => $items->values())->toArray();

        return response()->json([
            'data'    => empty($grouped) ? new \stdClass() : $grouped,
            'error'   => false,
            'message' => null,
        ]);
    }

    private function resolveLocale(Request $request): ?string
    {
        // Check explicit query param first
        $locale = $request->query('locale');
        if ($locale && in_array($locale, self::SUPPORTED_LOCALES)) {
            return $locale;
        }

        // Fall back to Accept-Language header
        $header = $request->header('Accept-Language', '');
        $code   = strtolower(substr($header, 0, 2));
        if ($code && in_array($code, self::SUPPORTED_LOCALES) && $code !== 'fr') {
            return $code;
        }

        return null;
    }
}
