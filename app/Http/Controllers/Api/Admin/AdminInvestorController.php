<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Investor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminInvestorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Investor::where('status', 'published')->get(), 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:120', 'description' => 'nullable|string|max:400', 'avatar' => 'nullable|string']);
        $inv = Investor::create(array_merge(['status' => 'published'], $data));
        return response()->json(['data' => $inv, 'error' => false, 'message' => 'Investor created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $inv = Investor::findOrFail($id);
        $data = $request->validate(['name' => 'sometimes|string|max:120', 'description' => 'nullable|string|max:400', 'avatar' => 'nullable|string']);
        $inv->update($data);
        return response()->json(['data' => $inv, 'error' => false, 'message' => 'Investor updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Investor::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Investor deleted.']);
    }
}
