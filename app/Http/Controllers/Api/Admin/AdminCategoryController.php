<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $cats = Category::withCount('properties')->orderBy('order')->get();
        return response()->json(['data' => $cats, 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:120', 'description' => 'nullable|string', 'order' => 'integer', 'parent_id' => 'integer']);
        $cat = Category::create(array_merge(['status' => 'published', 'order' => 0], $data));
        return response()->json(['data' => $cat, 'error' => false, 'message' => 'Category created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $cat = Category::findOrFail($id);
        $data = $request->validate(['name' => 'sometimes|string|max:120', 'description' => 'nullable|string', 'order' => 'integer', 'status' => 'in:published,draft']);
        $cat->update($data);
        return response()->json(['data' => $cat, 'error' => false, 'message' => 'Category updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Category::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Category deleted.']);
    }
}
