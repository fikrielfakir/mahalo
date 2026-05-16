<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Models\Property;
use App\Models\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Property::with(['city', 'slug'])
            ->orderBy('created_at', 'desc');

        if ($user->professional_agent_id) {
            $query->where(function ($q) use ($user) {
                $q->where(function ($q2) use ($user) {
                    $q2->where('author_id', $user->id)
                       ->where('author_type', 'App\\Models\\User');
                })->orWhere(function ($q2) use ($user) {
                    $q2->where('author_id', $user->professional_agent_id)
                       ->where('author_type', 'App\\Models\\Agent');
                });
            });
        } else {
            $query->where('author_id', $user->id)
                  ->where('author_type', 'App\\Models\\User');
        }

        $listings = $query->get()->map(fn($p) => $this->format($p));

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

        if ($user->professional_agent_id) {
            $authorId   = $user->professional_agent_id;
            $authorType = 'App\\Models\\Agent';
        } else {
            $authorId   = $user->id;
            $authorType = 'App\\Models\\User';
        }

        $property = Property::create([
            ...$data,
            'images'            => json_encode($data['images'] ?? []),
            'status'            => 'pending',
            'moderation_status' => 'pending',
            'author_id'         => $authorId,
            'author_type'       => $authorType,
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

        $slug = $p->slug ? $p->slug->key : (string) $p->id;
        $videoThumbnails = $this->getVideoThumbnails($images);

        return [
            'id'                => $p->id,
            'name'              => $p->name,
            'slug'              => $slug,
            'type'              => $p->type,
            'description'       => $p->description,
            'location'          => $p->location,
            'images'            => $images,
            'image'             => $images[0] ?? null,
            'video_thumbnails'  => $videoThumbnails,
            'thumbnail_url'     => $this->extractThumbnail($images, $videoThumbnails),
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

    private function isVideoPath(string $path): bool
    {
        return (bool) preg_match('/\.(mp4|mov|avi|mkv|webm|m4v)$/i', $path);
    }

    private function getVideoThumbnails(array $images): array
    {
        $videoPaths = array_values(array_filter($images, fn($img) => $this->isVideoPath($img)));
        if (empty($videoPaths)) return [];

        $records = MediaFile::whereIn('path', $videoPaths)
            ->whereNotNull('thumbnail_url')
            ->pluck('thumbnail_url', 'path');

        return $records->toArray();
    }

    private function extractThumbnail(array $images, array $videoThumbnails = []): ?string
    {
        foreach ($images as $img) {
            if ($this->isVideoPath($img)) {
                if (isset($videoThumbnails[$img])) {
                    return $videoThumbnails[$img];
                }
                continue;
            }
            return str_starts_with($img, 'http')
                ? $img
                : Storage::disk('public')->url($img);
        }
        return null;
    }
}
