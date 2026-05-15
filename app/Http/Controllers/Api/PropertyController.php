<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\Feature;
use App\Models\Property;
use App\Models\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
            ->whereIn('status', ['selling', 'renting']);

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

        if ($request->filled('facilities')) {
            // facilities linked via re_facilities_distances
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
            'data'  => $result->map(fn($p) => $this->formatProperty($p)),
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
        $q    = $request->input('q', '');
        $data = Property::with(['city', 'slug'])
            ->whereIn('status', ['selling', 'renting'])
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%$q%")
                      ->orWhere('location', 'like', "%$q%");
            })
            ->limit(20)
            ->get()
            ->map(fn($p) => $this->formatProperty($p));

        return response()->json(['data' => $data, 'error' => false, 'message' => null]);
    }

    public function show(string $slug): JsonResponse
    {
        $slugModel = Slug::where('key', $slug)
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Property')
            ->first();

        if ($slugModel) {
            $property = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
                ->find($slugModel->reference_id);
        } else {
            $property = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])
                ->whereIn('status', ['selling', 'renting'])
                ->where('name', 'like', "%$slug%")
                ->first();
        }

        if (! $property) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Property not found'], 404);
        }

        return response()->json(['data' => $this->formatProperty($property), 'error' => false, 'message' => null]);
    }

    public function showById(int $id): JsonResponse
    {
        $property = Property::with(['city', 'state', 'features', 'categories', 'agent', 'slug'])->find($id);

        if (! $property) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Property not found'], 404);
        }

        return response()->json(['data' => $this->formatProperty($property), 'error' => false, 'message' => null]);
    }

    public function filters(): JsonResponse
    {
        $cities = City::whereHas('properties', fn($q) => $q->whereIn('status', ['selling', 'renting']))
            ->select('id', 'name')
            ->get();

        $categories = Category::where('status', 'published')
            ->select('id', 'name')
            ->get();

        $features = Feature::where('status', 'published')
            ->select('id', 'name', 'icon')
            ->get();

        $priceRange = Property::whereIn('status', ['selling', 'renting'])
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return response()->json([
            'data' => [
                'cities'     => $cities,
                'categories' => $categories,
                'features'   => $features,
                'price_range' => $priceRange,
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    private function extractThumbnail(array $images): ?string
    {
        foreach ($images as $img) {
            if (!preg_match('/\.(mp4|mov|avi|mkv|webm|m4v)$/i', $img)) {
                return str_starts_with($img, 'http')
                    ? $img
                    : Storage::disk('public')->url($img);
            }
        }
        return null;
    }

    private function formatProperty(Property $property): array
    {
        $images = $property->images ?? [];
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }

        $slug = $property->slug ? $property->slug->key : (string) $property->id;

        return [
            'id'               => $property->id,
            'name'             => $property->name,
            'slug'             => $slug,
            'type'             => $property->type,
            'description'      => $property->description,
            'content'          => $property->content,
            'location'         => $property->location,
            'images'           => $images,
            'image'            => $images[0] ?? null,
            'thumbnail_url'    => $this->extractThumbnail($images),
            'number_bedroom'   => (int) $property->number_bedroom,
            'number_bathroom'  => (int) $property->number_bathroom,
            'number_floor'     => $property->number_floor,
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
    }
}
