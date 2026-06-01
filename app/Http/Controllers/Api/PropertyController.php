<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\Feature;
use App\Models\MediaFile;
use App\Models\Property;
use App\Models\Slug;
use App\Traits\AppliesContentTranslations;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    use AppliesContentTranslations;

    public function index(Request $request): JsonResponse
    {
        $locale = $this->resolveLocale($request);

        $query = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
            ->where('status', 'published');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('location', 'like', "%$search%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('is_featured')) {
            $query->where('is_featured', (bool) $request->is_featured);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('state_id')) {
            $query->where('state_id', $request->state_id);
        }

        if ($request->filled('country_id')) {
            $query->where('country_id', $request->country_id);
        }

        if ($request->filled('category_id')) {
            $query->whereHas('categories', fn($q) => $q->where('re_categories.id', $request->category_id));
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('min_square')) {
            $query->where('square', '>=', $request->min_square);
        }

        if ($request->filled('max_square')) {
            $query->where('square', '<=', $request->max_square);
        }

        if ($request->filled('number_bedroom')) {
            $query->where('number_bedroom', '>=', $request->number_bedroom);
        }

        if ($request->filled('number_bathroom')) {
            $query->where('number_bathroom', '>=', $request->number_bathroom);
        }

        if ($request->filled('features')) {
            $raw = $request->features;
            $ids = is_array($raw)
                ? $raw
                : explode(',', (string) $raw);
            $ids = array_values(array_filter(array_map('intval', $ids)));
            if (!empty($ids)) {
                $query->whereHas('features', fn($q) => $q->whereIn('re_features.id', $ids));
            }
        }

        $orderBy = in_array($request->order_by, ['created_at', 'name', 'price']) ? $request->order_by : 'created_at';
        $order   = $request->order === 'asc' ? 'asc' : 'desc';

        if ($request->boolean('is_featured')) {
            $query->orderBy('featured_priority', 'desc');
        }

        $query->orderBy($orderBy, $order);

        $perPage = min((int) ($request->per_page ?? 10), 100);
        $result  = $query->paginate($perPage);

        return response()->json([
            'data'  => $result->map(fn($p) => $this->formatProperty($p, $locale)),
            'links' => [
                'first' => $result->url(1),
                'last'  => $result->url($result->lastPage()),
                'prev'  => $result->previousPageUrl(),
                'next'  => $result->nextPageUrl(),
            ],
            'meta' => [
                'current_page'  => $result->currentPage(),
                'last_page'     => $result->lastPage(),
                'per_page'      => $result->perPage(),
                'total'         => $result->total(),
                'next_page_url' => $result->nextPageUrl(),
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $locale = $this->resolveLocale($request);
        $q      = $request->input('q', '');
        $data   = Property::with(['city', 'slug'])
            ->where('status', 'published')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%$q%")
                      ->orWhere('location', 'like', "%$q%");
            })
            ->limit(20)
            ->get()
            ->map(fn($p) => $this->formatProperty($p, $locale));

        return response()->json(['data' => $data, 'error' => false, 'message' => null]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $this->resolveLocale($request);

        $slugModel = Slug::where('key', $slug)
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Property')
            ->first();

        if ($slugModel) {
            $property = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
                ->find($slugModel->reference_id);
        } else {
            $property = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
                ->where('status', 'published')
                ->where('name', 'like', "%$slug%")
                ->first();
        }

        if (! $property) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Property not found'], 404);
        }

        return response()->json(['data' => $this->formatProperty($property, $locale), 'error' => false, 'message' => null]);
    }

    public function showById(Request $request, int $id): JsonResponse
    {
        $locale   = $this->resolveLocale($request);
        $property = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])->find($id);

        if (! $property) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Property not found'], 404);
        }

        return response()->json(['data' => $this->formatProperty($property, $locale), 'error' => false, 'message' => null]);
    }

    public function similar(Request $request, int $id): JsonResponse
    {
        $locale   = $this->resolveLocale($request);
        $property = Property::with(['city', 'categories', 'features'])->find($id);

        if (!$property) {
            return response()->json(['data' => [], 'error' => false, 'message' => null]);
        }

        $categoryIds = $property->categories->pluck('id')->toArray();
        $featureIds  = $property->features->pluck('id')->toArray();
        $price       = (float) $property->price;
        $minPrice    = $price > 0 ? $price * 0.60 : null;
        $maxPrice    = $price > 0 ? $price * 1.40 : null;
        $beds        = (int) $property->number_bedroom;
        $area        = (float) $property->square;

        // Fetch a broad candidate pool from the same status/city
        $candidates = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
            ->where('status', 'published')
            ->where('moderation_status', 'approved')
            ->where('id', '!=', $id)
            ->when($property->city_id, fn($q) => $q->where('city_id', $property->city_id))
            ->limit(50)
            ->get();

        // If same-city pool is too small, broaden to all
        if ($candidates->count() < 8) {
            $candidates = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
                ->where('status', 'published')
                ->where('moderation_status', 'approved')
                ->where('id', '!=', $id)
                ->limit(50)
                ->get();
        }

        // Score each candidate
        $scored = $candidates->map(function ($p) use (
            $property, $categoryIds, $featureIds,
            $price, $minPrice, $maxPrice, $beds, $area
        ) {
            $score = 0;

            // Same status (selling/renting) — strong signal
            if ($p->status === $property->status) {
                $score += 25;
            }

            // Same city
            if ($p->city_id && $p->city_id === $property->city_id) {
                $score += 30;
            }

            // Price proximity (±40% range, scaled by closeness)
            $pPrice = (float) $p->price;
            if ($price > 0 && $pPrice > 0) {
                $ratio = min($price, $pPrice) / max($price, $pPrice); // 1.0 = identical price
                if ($ratio >= 0.60) {
                    $score += (int) round($ratio * 20); // up to +20 pts
                }
            } elseif ($price === 0.0 && $pPrice === 0.0) {
                $score += 10;
            }

            // Bedroom proximity (±1)
            $pBeds = (int) $p->number_bedroom;
            if ($beds > 0 && $pBeds > 0) {
                $diff = abs($beds - $pBeds);
                if ($diff === 0) $score += 15;
                elseif ($diff === 1) $score += 8;
            }

            // Area proximity (±30%)
            $pArea = (float) $p->square;
            if ($area > 0 && $pArea > 0) {
                $areaRatio = min($area, $pArea) / max($area, $pArea);
                if ($areaRatio >= 0.70) {
                    $score += (int) round($areaRatio * 10); // up to +10 pts
                }
            }

            // Shared categories — up to +20 pts
            $pCatIds = $p->categories->pluck('id')->toArray();
            $sharedCats = count(array_intersect($categoryIds, $pCatIds));
            $score += min($sharedCats * 10, 20);

            // Shared features — up to +10 pts
            $pFeatIds = $p->features->pluck('id')->toArray();
            $sharedFeats = count(array_intersect($featureIds, $pFeatIds));
            $score += min($sharedFeats * 3, 10);

            // Boost featured properties
            if ($p->is_featured) {
                $score += 5;
            }

            return ['property' => $p, 'score' => $score];
        });

        $top = $scored
            ->sortByDesc('score')
            ->take(4)
            ->values()
            ->map(fn($item) => $this->formatProperty($item['property'], $locale));

        return response()->json(['data' => $top, 'error' => false, 'message' => null]);
    }

    public function filters(): JsonResponse
    {
        $cities = City::orderBy('name')->select('id', 'name', 'image', 'image_url')->get();

        $categories = Category::where('status', 'published')
            ->select('id', 'name')
            ->get();

        $features = Feature::where('status', 'published')
            ->select('id', 'name', 'icon')
            ->get();

        $priceRange = Property::where('status', 'published')
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return response()->json([
            'data' => [
                'cities'      => $cities,
                'categories'  => $categories,
                'features'    => $features,
                'price_range' => $priceRange,
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    private function isVideoPath(string $path): bool
    {
        return (bool) preg_match('/\.(mp4|mov|avi|mkv|webm|m4v)$/i', $path);
    }

    private function toStorageUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) {
            if (preg_match('|/storage/(.+)$|', $path, $m)) return '/storage/' . $m[1];
            return $path;
        }
        return str_starts_with($path, '/') ? $path : '/storage/' . $path;
    }

    private function extractThumbnail(array $images, array $videoThumbnails = []): ?string
    {
        foreach ($images as $img) {
            if ($this->isVideoPath($img)) {
                if (isset($videoThumbnails[$img])) return $videoThumbnails[$img];
                continue;
            }
            return str_starts_with($img, 'http') ? $img : '/storage/' . $img;
        }
        return null;
    }

    private function getVideoThumbnails(array $images): array
    {
        $videoPaths = array_values(array_filter($images, fn($img) => $this->isVideoPath($img)));
        if (empty($videoPaths)) return [];

        $records = MediaFile::whereIn('path', $videoPaths)
            ->whereNotNull('thumbnail_url')
            ->pluck('thumbnail_url', 'path');

        return $records->map(fn($url) => $this->toStorageUrl($url))->toArray();
    }

    private function formatProperty(Property $property, string $locale = 'fr'): array
    {
        $images = $property->images ?? [];
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }

        $slug            = $property->slug ? $property->slug->key : (string) $property->id;
        $videoThumbnails = $this->getVideoThumbnails($images);

        $data = [
            'id'               => $property->id,
            'name'             => $property->name,
            'slug'             => $slug,
            'type'             => $property->type,
            'description'      => $property->description,
            'content'          => $property->content,
            'location'         => $property->location,
            'images'           => $images,
            'image'            => $images[0] ?? null,
            'video_thumbnails' => $videoThumbnails,
            'thumbnail_url'    => $this->extractThumbnail($images, $videoThumbnails),
            'number_bedroom'   => (int) $property->number_bedroom,
            'number_bathroom'  => (int) $property->number_bathroom,
            'number_floor'     => $property->number_floor,
            'condition'        => $property->condition,
            'age_range'        => $property->age_range,
            'orientation'      => $property->orientation,
            'flooring'         => $property->flooring,
            'square'           => $property->square,
            'price'            => $property->price,
            'is_featured'      => $property->is_featured,
            'status'           => $property->status,
            'city'             => $property->city ? ['id' => $property->city->id, 'name' => $property->city->name] : null,
            'state'            => $property->state ? ['id' => $property->state->id, 'name' => $property->state->name] : null,
            'latitude'         => $property->latitude,
            'longitude'        => $property->longitude,
            'features'         => $property->features->map(fn($f) => ['id' => $f->id, 'name' => $f->name, 'icon' => $f->icon])->values(),
            'categories'       => $property->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->values(),
            'agent'            => $property->agent ? ['id' => $property->agent->id, 'name' => $property->agent->name, 'phone' => $property->agent->phone] : null,
            'views'            => $property->views,
            'created_at'       => $property->created_at,
        ];

        return $this->overlayTranslations($data, 'property', $property->id, $locale, ['name', 'description', 'content']);
    }
}
