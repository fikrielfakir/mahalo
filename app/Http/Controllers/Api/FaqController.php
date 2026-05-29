<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    public function index(): JsonResponse
    {
        $faqs = Faq::where('is_active', true)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'category', 'question', 'answer']);

        // Group by category — use stdClass so empty result serialises as {} not []
        $grouped = $faqs->groupBy('category')->map(fn($items) => $items->values())->toArray();

        return response()->json([
            'data'    => empty($grouped) ? new \stdClass() : $grouped,
            'error'   => false,
            'message' => null,
        ]);
    }
}
