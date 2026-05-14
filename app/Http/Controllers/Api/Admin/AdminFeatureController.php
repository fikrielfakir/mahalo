<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFeatureController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Feature::all(), 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:120', 'icon' => 'nullable|string|max:60']);
        $f = Feature::create(array_merge(['status' => 'published'], $data));
        return response()->json(['data' => $f, 'error' => false, 'message' => 'Feature created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $f = Feature::findOrFail($id);
        $data = $request->validate(['name' => 'sometimes|string|max:120', 'icon' => 'nullable|string|max:60', 'status' => 'in:published,draft']);
        $f->update($data);
        return response()->json(['data' => $f, 'error' => false, 'message' => 'Feature updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Feature::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Feature deleted.']);
    }
}
