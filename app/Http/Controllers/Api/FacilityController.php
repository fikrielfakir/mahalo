<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->per_page ?? 10), 100);
        $result  = Facility::where('status', 'published')->paginate($perPage);

        return response()->json([
            'data'  => $result->items(),
            'meta'  => ['total' => $result->total(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function all(): JsonResponse
    {
        $facilities = Facility::where('status', 'published')->get();

        return response()->json(['data' => $facilities, 'error' => false, 'message' => null]);
    }

    public function show(int $id): JsonResponse
    {
        $facility = Facility::find($id);

        if (! $facility) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Facility not found'], 404);
        }

        return response()->json(['data' => $facility, 'error' => false, 'message' => null]);
    }
}
