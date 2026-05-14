<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $listings = Property::with(['city'])
            ->where('author_id', $user->id)
            ->where('author_type', 'App\\Models\\User')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => $this->format($p));

        return response()->json([
            'data'    => $listings,
            'error'   => false,
            'message' => null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'            => 'required|string|max:300',
            'type'            => 'required|in:sale,rent',
            'description'     => 'nullable|string|max:400',
            'location'        => 'nullable|string|max:255',
            'images'          => 'nullable|array',
            'images.*'        => 'nullable|string',
            'number_bedroom'  => 'nullable|numeric|min:0',
            'number_bathroom' => 'nullable|numeric|min:0',
            'square'          => 'nullable|numeric|min:0',
            'price'           => 'nullable|numeric|min:0',
            'city_id'         => 'nullable|integer',
            'latitude'        => 'nullable|string',
            'longitude'       => 'nullable|string',
            'content'         => 'nullable|string',
        ]);

        $property = Property::create([
            ...$data,
            'images'            => json_encode($data['images'] ?? []),
            'status'            => 'pending',
            'moderation_status' => 'pending',
            'author_id'         => $user->id,
            'author_type'       => 'App\\Models\\User',
            'unique_id'         => 'USER-' . strtoupper(Str::random(6)),
        ]);

        Slug::create([
            'key'            => Str::slug($property->name) . '-' . $property->id,
            'reference_id'   => $property->id,
            'reference_type' => 'Botble\\RealEstate\\Models\\Property',
            'prefix'         => 'properties',
        ]);

        return response()->json([
            'data'    => $this->format($property->fresh(['city'])),
            'error'   => false,
            'message' => 'Listing submitted for review.',
        ], 201);
    }

    private function format(Property $p): array
    {
        $images = $p->images ?? [];
        if (is_string($images)) $images = json_decode($images, true) ?? [];

        return [
            'id'                => $p->id,
            'name'              => $p->name,
            'type'              => $p->type,
            'description'       => $p->description,
            'location'          => $p->location,
            'images'            => $images,
            'image'             => $images[0] ?? null,
            'number_bedroom'    => (int) $p->number_bedroom,
            'number_bathroom'   => (int) $p->number_bathroom,
            'square'            => $p->square,
            'price'             => $p->price,
            'status'            => $p->status,
            'moderation_status' => $p->moderation_status,
            'city'              => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
            'latitude'          => $p->latitude,
            'longitude'         => $p->longitude,
            'created_at'        => $p->created_at,
        ];
    }
}
