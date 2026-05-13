<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    public function ids(Request $request)
    {
        $ids = DB::table('favorites')
            ->where('user_id', $request->user()->id)
            ->pluck('property_id')
            ->map(fn($id) => (int) $id)
            ->values()
            ->toArray();

        return response()->json(['data' => $ids, 'error' => false]);
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $propertyIds = DB::table('favorites')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->pluck('property_id');

        $properties = Property::whereIn('id', $propertyIds)
            ->with(['city', 'category'])
            ->get()
            ->sortBy(fn($p) => array_search($p->id, $propertyIds->toArray()))
            ->values();

        return response()->json([
            'data'  => $properties,
            'error' => false,
        ]);
    }

    public function toggle(Request $request, int $propertyId)
    {
        $userId = $request->user()->id;

        $exists = DB::table('favorites')
            ->where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->exists();

        if ($exists) {
            DB::table('favorites')
                ->where('user_id', $userId)
                ->where('property_id', $propertyId)
                ->delete();
            $favorited = false;
        } else {
            DB::table('favorites')->insertOrIgnore([
                'user_id'     => $userId,
                'property_id' => $propertyId,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
            $favorited = true;
        }

        $ids = DB::table('favorites')
            ->where('user_id', $userId)
            ->pluck('property_id')
            ->map(fn($id) => (int) $id)
            ->values()
            ->toArray();

        return response()->json([
            'data'      => ['favorited' => $favorited, 'ids' => $ids],
            'error'     => false,
            'message'   => $favorited ? 'Added to favorites.' : 'Removed from favorites.',
        ]);
    }
}
