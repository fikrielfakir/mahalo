<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFaqController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Faq::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('question', 'like', "%$s%")->orWhere('answer', 'like', "%$s%"));
        }

        $faqs = $query->orderBy('category')->orderBy('sort_order')->orderBy('id')->get();

        return response()->json(['data' => $faqs, 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category'   => 'required|string|max:100',
            'question'   => 'required|string|max:500',
            'answer'     => 'required|string|max:5000',
            'sort_order' => 'integer|min:0',
            'is_active'  => 'boolean',
        ]);

        $faq = Faq::create($data);

        return response()->json(['data' => $faq, 'error' => false, 'message' => 'FAQ created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $faq  = Faq::findOrFail($id);
        $data = $request->validate([
            'category'   => 'sometimes|string|max:100',
            'question'   => 'sometimes|string|max:500',
            'answer'     => 'sometimes|string|max:5000',
            'sort_order' => 'sometimes|integer|min:0',
            'is_active'  => 'sometimes|boolean',
        ]);

        $faq->update($data);

        return response()->json(['data' => $faq, 'error' => false, 'message' => 'FAQ updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Faq::findOrFail($id)->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'FAQ deleted.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $data = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        Faq::whereIn('id', $data['ids'])->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => count($data['ids']) . ' FAQs deleted.']);
    }
}
