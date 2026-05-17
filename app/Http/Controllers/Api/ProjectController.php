<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Project;
use App\Models\Property;
use App\Models\Slug;
use App\Traits\AppliesContentTranslations;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use AppliesContentTranslations;

    public function index(Request $request): JsonResponse
    {
        $locale = $this->resolveLocale($request);

        $query = Project::with(['city', 'investor', 'slug'])
            ->where('status', 'selling');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('is_featured')) {
            $query->where('is_featured', (bool) $request->is_featured);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $orderBy = in_array($request->order_by, ['created_at', 'name']) ? $request->order_by : 'created_at';
        $order   = $request->order === 'asc' ? 'asc' : 'desc';

        if ($request->boolean('is_featured')) {
            $query->orderBy('featured_priority', 'desc');
        }

        $query->orderBy($orderBy, $order);

        $perPage = min((int) ($request->per_page ?? 10), 100);
        $result  = $query->paginate($perPage);

        return response()->json([
            'data'  => $result->map(fn($p) => $this->formatProject($p, $locale)),
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
        $data   = Project::with(['city', 'slug'])
            ->where('status', 'selling')
            ->where('name', 'like', "%$q%")
            ->limit(20)
            ->get()
            ->map(fn($p) => $this->formatProject($p, $locale));

        return response()->json(['data' => $data, 'error' => false, 'message' => null]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $this->resolveLocale($request);

        $slugModel = Slug::where('key', $slug)
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Project')
            ->first();

        if ($slugModel) {
            $project = Project::with(['city', 'investor', 'features', 'categories', 'slug'])->find($slugModel->reference_id);
        } else {
            $project = Project::with(['city', 'investor', 'features', 'categories', 'slug'])
                ->where('status', 'selling')
                ->where('name', 'like', "%$slug%")
                ->first();
        }

        if (! $project) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Project not found'], 404);
        }

        return response()->json(['data' => $this->formatProject($project, $locale), 'error' => false, 'message' => null]);
    }

    public function showById(Request $request, int $id): JsonResponse
    {
        $locale  = $this->resolveLocale($request);
        $project = Project::with(['city', 'investor', 'features', 'categories', 'slug'])->find($id);

        if (! $project) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Project not found'], 404);
        }

        return response()->json(['data' => $this->formatProject($project, $locale), 'error' => false, 'message' => null]);
    }

    public function properties(int $id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Project not found'], 404);
        }

        $properties = Property::with(['city', 'features', 'slug'])
            ->where('project_id', $id)
            ->where('status', 'selling')
            ->paginate(10);

        return response()->json([
            'data'    => $properties->items(),
            'meta'    => ['total' => $properties->total()],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function filters(): JsonResponse
    {
        $cities = City::whereHas('projects', fn($q) => $q->where('status', 'selling'))
            ->select('id', 'name')
            ->get();

        $priceRange = Project::where('status', 'selling')
            ->selectRaw('MIN(price_from) as min_price, MAX(price_to) as max_price')
            ->first();

        return response()->json([
            'data'    => ['cities' => $cities, 'price_range' => $priceRange],
            'error'   => false,
            'message' => null,
        ]);
    }

    private function formatProject(Project $project, string $locale = 'fr'): array
    {
        $images = $project->images ?? [];
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }

        $slug = $project->slug ? $project->slug->key : (string) $project->id;

        $data = [
            'id'          => $project->id,
            'name'        => $project->name,
            'slug'        => $slug,
            'description' => $project->description,
            'content'     => $project->content,
            'location'    => $project->location,
            'images'      => $images,
            'image'       => $images[0] ?? null,
            'is_featured' => $project->is_featured,
            'price_from'  => $project->price_from,
            'price_to'    => $project->price_to,
            'status'      => $project->status,
            'city'        => $project->city ? ['id' => $project->city->id, 'name' => $project->city->name] : null,
            'investor'    => $project->investor ? ['id' => $project->investor->id, 'name' => $project->investor->name] : null,
            'latitude'    => $project->latitude,
            'longitude'   => $project->longitude,
            'views'       => $project->views,
            'created_at'  => $project->created_at,
        ];

        return $this->overlayTranslations($data, 'project', $project->id, $locale, ['name', 'description', 'content']);
    }
}
