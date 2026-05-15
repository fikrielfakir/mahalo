<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::with(['city', 'categories', 'features', 'agent', 'slug']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('location', 'like', "%$s%"));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('moderation_status')) {
            $query->where('moderation_status', $request->moderation_status);
        }

        $result = $query->orderBy('created_at', 'desc')->paginate((int) ($request->per_page ?? 15));

        return response()->json([
            'data' => $result->map(fn($p) => $this->format($p)),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'            => 'required|string|max:300',
            'type'            => 'required|in:sale,rent',
            'description'     => 'nullable|string|max:400',
            'content'         => 'nullable|string',
            'location'        => 'nullable|string|max:255',
            'images'          => 'nullable|array',
            'images.*'        => 'nullable|string',
            'number_bedroom'  => 'nullable|numeric|min:0',
            'number_bathroom' => 'nullable|numeric|min:0',
            'number_floor'    => 'nullable|integer|min:0',
            'square'          => 'nullable|numeric|min:0',
            'price'           => 'nullable|numeric|min:0',
            'is_featured'     => 'boolean',
            'city_id'         => 'nullable|integer',
            'agent_id'        => 'nullable|integer',
            'status'          => 'in:selling,pending,sold,rented',
            'category_ids'    => 'nullable|array',
            'feature_ids'     => 'nullable|array',
            'latitude'        => 'nullable|string',
            'longitude'       => 'nullable|string',
            'condition'       => 'nullable|string|max:80',
            'age_range'       => 'nullable|string|max:80',
            'orientation'     => 'nullable|string|max:80',
            'flooring'        => 'nullable|string|max:80',
            'slug'            => 'nullable|string|max:300',
        ]);

        $agentId = $data['agent_id'] ?? null;
        $customSlug = $data['slug'] ?? null;
        unset($data['agent_id'], $data['slug'], $data['category_ids'], $data['feature_ids']);

        $property = Property::create([
            ...$data,
            'images'            => json_encode($data['images'] ?? []),
            'status'            => $data['status'] ?? 'selling',
            'moderation_status' => 'approved',
            'unique_id'         => 'PROP-' . strtoupper(Str::random(6)),
            'author_id'         => $agentId ?: null,
            'author_type'       => $agentId ? 'App\\Models\\Agent' : null,
        ]);

        if (!empty($request->category_ids)) {
            $property->categories()->sync($request->category_ids);
        }
        if (!empty($request->feature_ids)) {
            $property->features()->sync($request->feature_ids);
        }

        $slugKey = $customSlug
            ? Str::slug($customSlug)
            : Str::slug($property->name) . '-' . $property->id;

        if (!$slugKey) $slugKey = 'property-' . $property->id;

        Slug::create([
            'key'            => $slugKey,
            'reference_id'   => $property->id,
            'reference_type' => 'Botble\\RealEstate\\Models\\Property',
            'prefix'         => 'properties',
        ]);

        return response()->json(['data' => $this->format($property->fresh(['city', 'categories', 'features', 'agent', 'slug'])), 'error' => false, 'message' => 'Property created.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $p = Property::with(['city', 'categories', 'features', 'agent', 'slug'])->findOrFail($id);
        return response()->json(['data' => $this->format($p), 'error' => false, 'message' => null]);
    }

    public function moderation(Request $request, int $id): JsonResponse
    {
        $property = Property::findOrFail($id);

        $data = $request->validate([
            'moderation_status' => 'required|in:pending,approved,rejected',
            'reject_reason'     => 'nullable|string|max:400',
        ]);

        $updates = ['moderation_status' => $data['moderation_status']];

        if ($data['moderation_status'] === 'approved') {
            $updates['status'] = $property->type === 'rent' ? 'renting' : 'selling';
        } elseif ($data['moderation_status'] === 'rejected') {
            $updates['status'] = 'pending';
            if (isset($data['reject_reason'])) {
                $updates['reject_reason'] = $data['reject_reason'];
            }
        }

        $property->update($updates);

        return response()->json([
            'data'    => $this->format($property->fresh(['city', 'categories', 'features', 'agent', 'slug'])),
            'error'   => false,
            'message' => 'Moderation status updated.',
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $property = Property::findOrFail($id);

        $data = $request->validate([
            'name'              => 'sometimes|string|max:300',
            'type'              => 'sometimes|in:sale,rent',
            'description'       => 'nullable|string|max:400',
            'content'           => 'nullable|string',
            'location'          => 'nullable|string|max:255',
            'images'            => 'nullable|array',
            'images.*'          => 'nullable|string',
            'number_bedroom'    => 'nullable|numeric|min:0',
            'number_bathroom'   => 'nullable|numeric|min:0',
            'number_floor'      => 'nullable|integer|min:0',
            'square'            => 'nullable|numeric|min:0',
            'price'             => 'nullable|numeric|min:0',
            'is_featured'       => 'boolean',
            'city_id'           => 'nullable|integer',
            'agent_id'          => 'nullable|integer',
            'status'            => 'sometimes|in:selling,pending,sold,rented,renting',
            'moderation_status' => 'sometimes|in:pending,approved,rejected',
            'category_ids'      => 'nullable|array',
            'feature_ids'       => 'nullable|array',
            'latitude'          => 'nullable|string',
            'longitude'         => 'nullable|string',
            'condition'         => 'nullable|string|max:80',
            'age_range'         => 'nullable|string|max:80',
            'orientation'       => 'nullable|string|max:80',
            'flooring'          => 'nullable|string|max:80',
            'slug'              => 'nullable|string|max:300',
        ]);

        if (isset($data['images'])) {
            $data['images'] = json_encode($data['images']);
        }

        $agentId = array_key_exists('agent_id', $data) ? $data['agent_id'] : false;
        $newSlugKey = array_key_exists('slug', $data) ? $data['slug'] : false;
        unset($data['agent_id'], $data['slug']);

        if ($agentId !== false) {
            $data['author_id']   = $agentId ?: null;
            $data['author_type'] = $agentId ? 'App\\Models\\Agent' : null;
        }

        $categoryIds = array_key_exists('category_ids', $data) ? $data['category_ids'] : false;
        $featureIds  = array_key_exists('feature_ids', $data)  ? $data['feature_ids']  : false;
        unset($data['category_ids'], $data['feature_ids']);

        $property->update($data);

        if ($categoryIds !== false) {
            $property->categories()->sync($categoryIds ?? []);
        }
        if ($featureIds !== false) {
            $property->features()->sync($featureIds ?? []);
        }

        // Update or create slug if a new value was sent
        if ($newSlugKey !== false && $newSlugKey) {
            $cleanSlug = Str::slug($newSlugKey) ?: 'property-' . $property->id;
            $slugModel = Slug::where('reference_id', $id)
                ->where('reference_type', 'Botble\\RealEstate\\Models\\Property')
                ->first();
            if ($slugModel) {
                $slugModel->update(['key' => $cleanSlug]);
            } else {
                Slug::create([
                    'key'            => $cleanSlug,
                    'reference_id'   => $property->id,
                    'reference_type' => 'Botble\\RealEstate\\Models\\Property',
                    'prefix'         => 'properties',
                ]);
            }
        }

        return response()->json(['data' => $this->format($property->fresh(['city', 'categories', 'features', 'agent', 'slug'])), 'error' => false, 'message' => 'Property updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        $property = Property::findOrFail($id);
        $property->features()->detach();
        $property->categories()->detach();
        Slug::where('reference_id', $id)->where('reference_type', 'Botble\\RealEstate\\Models\\Property')->delete();
        $property->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'Property deleted.']);
    }

    private function format(Property $p): array
    {
        $images = $p->images ?? [];
        if (is_string($images)) $images = json_decode($images, true) ?? [];
        return [
            'id'                => $p->id,
            'name'              => $p->name,
            'slug'              => $p->slug?->key ?? '',
            'type'              => $p->type,
            'description'       => $p->description,
            'content'           => $p->content,
            'location'          => $p->location,
            'images'            => $images,
            'number_bedroom'    => (int) $p->number_bedroom,
            'number_bathroom'   => (int) $p->number_bathroom,
            'number_floor'      => $p->number_floor,
            'condition'         => $p->condition,
            'age_range'         => $p->age_range,
            'orientation'       => $p->orientation,
            'flooring'          => $p->flooring,
            'square'            => $p->square,
            'price'             => $p->price,
            'is_featured'       => (bool) $p->is_featured,
            'status'            => $p->status,
            'moderation_status' => $p->moderation_status,
            'reject_reason'     => $p->reject_reason,
            'author_id'         => $p->author_id,
            'author_type'       => $p->author_type,
            'agent_id'          => ($p->author_type === 'App\\Models\\Agent') ? $p->author_id : null,
            'agent'             => ($p->author_type === 'App\\Models\\Agent' && $p->agent)
                                     ? ['id' => $p->agent->id, 'name' => $p->agent->name]
                                     : null,
            'city_id'           => $p->city_id,
            'city'              => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
            'latitude'          => $p->latitude,
            'longitude'         => $p->longitude,
            'categories'        => $p->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->values(),
            'category_ids'      => $p->categories->pluck('id')->values(),
            'features'          => $p->features->map(fn($f) => ['id' => $f->id, 'name' => $f->name])->values(),
            'feature_ids'       => $p->features->pluck('id')->values(),
            'views'             => $p->views,
            'created_at'        => $p->created_at,
            'updated_at'        => $p->updated_at,
        ];
    }
}
