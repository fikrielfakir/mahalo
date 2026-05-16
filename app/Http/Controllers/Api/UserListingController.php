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
            'description'     => 'nullable|string|max:5000',
            'location'        => 'nullable|string|max:255',
            'images'          => 'nullable|array',
            'images.*'        => 'nullable|string',
            'number_bedroom'  => 'nullable|numeric|min:0',
            'number_bathroom' => 'nullable|numeric|min:0',
            'number_floor'    => 'nullable|numeric|min:0',
            'square'          => 'nullable|numeric|min:0',
            'price'           => 'nullable|numeric|min:0',
            'city_id'         => 'nullable|integer',
            'latitude'        => 'nullable|string',
            'longitude'       => 'nullable|string',
            // category, features & facilities
            'category_id'          => 'nullable|integer|exists:re_categories,id',
            'feature_ids'          => 'nullable|array',
            'feature_ids.*'        => 'nullable|integer|exists:re_features,id',
            'facility_distances'   => 'nullable|array',
            'facility_distances.*' => 'nullable|array',
            'facility_distances.*.facility_id' => 'required_with:facility_distances.*|integer|exists:re_facilities,id',
            'facility_distances.*.distance'    => 'nullable|string|max:50',
            // extra fields stored in content
            'total_floors'    => 'nullable|integer|min:0',
            'year_built'      => 'nullable|integer|min:1800',
            'titre_foncier'   => 'nullable|string|max:100',
            'available_from'  => 'nullable|date',
            'virtual_tour'    => 'nullable|url|max:500',
            'contact_method'  => 'nullable|in:phone,whatsapp,email',
            'best_time'       => 'nullable|in:Morning,Afternoon,Evening',
        ]);

        if ($user->professional_agent_id) {
            $authorId   = $user->professional_agent_id;
            $authorType = 'App\\Models\\Agent';
        } else {
            $authorId   = $user->id;
            $authorType = 'App\\Models\\User';
        }

        // Build the content JSON with extra fields
        $contentData = array_filter([
            'total_floors'   => $data['total_floors']   ?? null,
            'year_built'     => $data['year_built']     ?? null,
            'titre_foncier'  => $data['titre_foncier']  ?? null,
            'available_from' => $data['available_from'] ?? null,
            'virtual_tour'   => $data['virtual_tour']   ?? null,
            'contact_method' => $data['contact_method'] ?? null,
            'best_time'      => $data['best_time']      ?? null,
        ], fn($v) => $v !== null);

        $property = Property::create([
            'name'            => $data['name'],
            'type'            => $data['type'],
            'description'     => $data['description']     ?? null,
            'location'        => $data['location']        ?? null,
            'images'          => $data['images']          ?? [],
            'number_bedroom'  => $data['number_bedroom']  ?? null,
            'number_bathroom' => $data['number_bathroom'] ?? null,
            'number_floor'    => $data['number_floor']    ?? null,
            'square'          => $data['square']          ?? null,
            'price'           => $data['price']           ?? null,
            'city_id'         => $data['city_id']         ?? null,
            'latitude'        => $data['latitude']        ?? null,
            'longitude'       => $data['longitude']       ?? null,
            'content'         => !empty($contentData) ? json_encode($contentData) : null,
            'status'          => 'pending',
            'moderation_status' => 'pending',
            'author_id'       => $authorId,
            'author_type'     => $authorType,
            'unique_id'       => 'USER-' . strtoupper(Str::random(6)),
        ]);

        // Attach category (many-to-many)
        if (!empty($data['category_id'])) {
            $property->categories()->sync([$data['category_id']]);
        }

        // Attach features (many-to-many)
        if (!empty($data['feature_ids'])) {
            $property->features()->sync($data['feature_ids']);
        }

        // Attach facilities with distance (pivot)
        if (!empty($data['facility_distances'])) {
            $pivotData = [];
            foreach ($data['facility_distances'] as $entry) {
                $pivotData[(int) $entry['facility_id']] = [
                    'distance'       => $entry['distance'] ?? null,
                    'reference_type' => 'Botble\\RealEstate\\Models\\Property',
                ];
            }
            $property->facilities()->sync($pivotData);
        }

        Slug::create([
            'key'            => Str::slug($property->name) . '-' . $property->id,
            'reference_id'   => $property->id,
            'reference_type' => 'Botble\\RealEstate\\Models\\Property',
            'prefix'         => 'properties',
        ]);

        return response()->json([
            'data'    => $this->format($property->fresh(['city', 'categories', 'features'])),
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
            'number_floor'      => $p->number_floor,
            'square'            => $p->square,
            'price'             => $p->price,
            'status'            => $p->status,
            'moderation_status' => $p->moderation_status,
            'city'              => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
            'categories'        => $p->relationLoaded('categories') ? $p->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->toArray() : [],
            'features'          => $p->relationLoaded('features')   ? $p->features->map(fn($f) => ['id' => $f->id, 'name' => $f->name])->toArray() : [],
            'latitude'          => $p->latitude,
            'longitude'         => $p->longitude,
            'content'           => $p->content ? json_decode($p->content, true) : null,
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
