<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->per_page ?? 10), 100);
        $result  = Feature::where('status', 'published')->paginate($perPage);

        return response()->json([
            'data'  => $result->items(),
            'meta'  => ['total' => $result->total(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function all(): JsonResponse
    {
        $features = Feature::where('status', 'published')->get();

        return response()->json(['data' => $features, 'error' => false, 'message' => null]);
    }

    public function show(int $id): JsonResponse
    {
        $feature = Feature::find($id);

        if (! $feature) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Feature not found'], 404);
        }

        return response()->json(['data' => $feature, 'error' => false, 'message' => null]);
    }
}
