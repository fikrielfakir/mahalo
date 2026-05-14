<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::with(['city', 'investor']);
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
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
            'name'        => 'required|string|max:300',
            'description' => 'nullable|string|max:400',
            'content'     => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'images'      => 'nullable|array',
            'images.*'    => 'nullable|string',
            'investor_id' => 'nullable|integer',
            'city_id'     => 'nullable|integer',
            'price_from'  => 'nullable|numeric|min:0',
            'price_to'    => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'status'      => 'in:selling,pending,completed',
        ]);

        $project = Project::create([
            ...$data,
            'images' => json_encode($data['images'] ?? []),
            'status' => $data['status'] ?? 'selling',
            'country_id' => 1,
        ]);

        Slug::create([
            'key'            => Str::slug($project->name) . '-' . $project->id,
            'reference_id'   => $project->id,
            'reference_type' => 'Botble\\RealEstate\\Models\\Project',
            'prefix'         => 'projects',
        ]);

        return response()->json(['data' => $this->format($project->fresh(['city', 'investor'])), 'error' => false, 'message' => 'Project created.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $p = Project::with(['city', 'investor'])->findOrFail($id);
        return response()->json(['data' => $this->format($p), 'error' => false, 'message' => null]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $data = $request->validate([
            'name'        => 'sometimes|string|max:300',
            'description' => 'nullable|string|max:400',
            'content'     => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'images'      => 'nullable|array',
            'images.*'    => 'nullable|string',
            'investor_id' => 'nullable|integer',
            'city_id'     => 'nullable|integer',
            'price_from'  => 'nullable|numeric|min:0',
            'price_to'    => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'status'      => 'sometimes|in:selling,pending,completed',
        ]);
        if (isset($data['images'])) $data['images'] = json_encode($data['images']);
        $project->update($data);

        return response()->json(['data' => $this->format($project->fresh(['city', 'investor'])), 'error' => false, 'message' => 'Project updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        Slug::where('reference_id', $id)->where('reference_type', 'Botble\\RealEstate\\Models\\Project')->delete();
        $project->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Project deleted.']);
    }

    private function format(Project $p): array
    {
        $images = $p->images ?? [];
        if (is_string($images)) $images = json_decode($images, true) ?? [];
        return [
            'id'          => $p->id,
            'name'        => $p->name,
            'description' => $p->description,
            'content'     => $p->content,
            'location'    => $p->location,
            'images'      => $images,
            'investor_id' => $p->investor_id,
            'investor'    => $p->investor ? ['id' => $p->investor->id, 'name' => $p->investor->name] : null,
            'city_id'     => $p->city_id,
            'city'        => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
            'price_from'  => $p->price_from,
            'price_to'    => $p->price_to,
            'is_featured' => (bool) $p->is_featured,
            'status'      => $p->status,
            'views'       => $p->views,
            'created_at'  => $p->created_at,
            'updated_at'  => $p->updated_at,
        ];
    }
}
