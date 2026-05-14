<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function forProperty(int $propertyId): JsonResponse
    {
        $reviews = Review::with(['agent'])
            ->where('reviewable_id', $propertyId)
            ->where('reviewable_type', 'Botble\\RealEstate\\Models\\Property')
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data'  => $reviews->map(fn($r) => [
                'id'         => $r->id,
                'star'       => $r->star,
                'content'    => $r->content,
                'created_at' => $r->created_at,
                'agent'      => $r->agent ? ['name' => $r->agent->name] : null,
            ]),
            'meta'    => ['total' => $reviews->total()],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function store(int $propertyId, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'star'    => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:500',
        ]);

        $property = Property::find($propertyId);

        if (! $property) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Property not found'], 404);
        }

        $review = Review::create([
            'account_id'       => $request->user()->id,
            'reviewable_id'    => $propertyId,
            'reviewable_type'  => 'Botble\\RealEstate\\Models\\Property',
            'star'             => $validated['star'],
            'content'          => $validated['comment'],
            'status'           => 'approved',
        ]);

        return response()->json(['data' => $review, 'error' => false, 'message' => 'Review submitted.'], 201);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $review = Review::where('id', $id)
            ->where('account_id', $request->user()->id)
            ->first();

        if (! $review) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Review not found'], 404);
        }

        $validated = $request->validate([
            'star'    => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|max:500',
        ]);

        $review->update([
            'star'    => $validated['star'] ?? $review->star,
            'content' => $validated['comment'] ?? $review->content,
        ]);

        return response()->json(['data' => $review, 'error' => false, 'message' => 'Review updated.']);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $review = Review::where('id', $id)
            ->where('account_id', $request->user()->id)
            ->first();

        if (! $review) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Review not found'], 404);
        }

        $review->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'Review deleted.']);
    }
}
