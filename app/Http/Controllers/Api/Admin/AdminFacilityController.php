<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFacilityController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Facility::all(), 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:120', 'icon' => 'nullable|string|max:60']);
        $f = Facility::create(array_merge(['status' => 'published'], $data));
        return response()->json(['data' => $f, 'error' => false, 'message' => 'Facility created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $f = Facility::findOrFail($id);
        $data = $request->validate(['name' => 'sometimes|string|max:120', 'icon' => 'nullable|string|max:60', 'status' => 'in:published,draft']);
        $f->update($data);
        return response()->json(['data' => $f, 'error' => false, 'message' => 'Facility updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Facility::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Facility deleted.']);
    }
}
