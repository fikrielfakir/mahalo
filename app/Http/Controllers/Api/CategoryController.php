<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::where('status', 'published')
            ->orderBy('order')
            ->get()
            ->map(fn($c) => $this->formatCategory($c));

        return response()->json(['data' => $categories, 'error' => false, 'message' => null]);
    }

    public function show(string $slug): JsonResponse
    {
        $slugModel = Slug::where('key', $slug)
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Category')
            ->first();

        $category = $slugModel
            ? Category::find($slugModel->reference_id)
            : Category::where('status', 'published')->where('name', 'like', "%$slug%")->first();

        if (! $category) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Category not found'], 404);
        }

        return response()->json(['data' => $this->formatCategory($category), 'error' => false, 'message' => null]);
    }

    public function showById(int $id): JsonResponse
    {
        $category = Category::find($id);

        if (! $category) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Category not found'], 404);
        }

        return response()->json(['data' => $this->formatCategory($category), 'error' => false, 'message' => null]);
    }

    public function properties(int $id, Request $request): JsonResponse
    {
        $category = Category::find($id);

        if (! $category) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Category not found'], 404);
        }

        $perPage = min((int) ($request->per_page ?? 10), 100);
        $props   = $category->properties()
            ->with(['city', 'slug'])
            ->whereIn('status', ['selling', 'renting'])
            ->paginate($perPage);

        return response()->json([
            'data'    => $props->items(),
            'meta'    => ['total' => $props->total()],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function filters(): JsonResponse
    {
        $categories = Category::where('status', 'published')
            ->withCount(['properties' => fn($q) => $q->whereIn('status', ['selling', 'renting'])])
            ->orderBy('order')
            ->get()
            ->map(fn($c) => array_merge($this->formatCategory($c), ['property_count' => $c->properties_count]));

        return response()->json(['data' => $categories, 'error' => false, 'message' => null]);
    }

    private function formatCategory(Category $category): array
    {
        return [
            'id'          => $category->id,
            'name'        => $category->name,
            'description' => $category->description,
            'parent_id'   => $category->parent_id,
            'order'       => $category->order,
        ];
    }
}
