<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Consult;
use App\Models\Property;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AgentDashboardController extends Controller
{
    private function getAgent(Request $request): ?Agent
    {
        $user = $request->user();
        if (!$user || !$user->professional_agent_id) return null;
        return Agent::find($user->professional_agent_id);
    }

    public function overview(Request $request): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) {
            return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);
        }

        $propertyIds = Property::where('author_id', $agent->id)->pluck('id');
        $projectIds  = Project::where('author_id', $agent->id)->pluck('id');

        $totalViews = Property::where('author_id', $agent->id)->sum('views')
                    + Project::where('author_id', $agent->id)->sum('views');

        $messagesCount = Consult::where(function ($q) use ($propertyIds, $projectIds) {
            $q->whereIn('property_id', $propertyIds)
              ->orWhereIn('project_id', $projectIds);
        })->count();

        $propertiesCount = $propertyIds->count();
        $projectsCount   = $projectIds->count();

        $recentMessages = Consult::where(function ($q) use ($propertyIds, $projectIds) {
            $q->whereIn('property_id', $propertyIds)->orWhereIn('project_id', $projectIds);
        })->with(['property:id,name', 'project:id,name'])->orderByDesc('created_at')->limit(5)->get();

        $topProperties = Property::where('author_id', $agent->id)
            ->orderByDesc('views')->limit(5)
            ->get(['id', 'name', 'views', 'type', 'price', 'status', 'moderation_status']);

        return response()->json([
            'data' => [
                'agent'            => $this->formatAgent($agent),
                'stats'            => [
                    'properties'   => $propertiesCount,
                    'projects'     => $projectsCount,
                    'total_views'  => (int) $totalViews,
                    'messages'     => $messagesCount,
                ],
                'recent_messages'  => $recentMessages,
                'top_properties'   => $topProperties,
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function properties(Request $request): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $query = Property::with(['city', 'categories'])->where('author_id', $agent->id);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('location', 'like', "%$s%"));
        }

        $result = $query->orderByDesc('created_at')->paginate((int)($request->per_page ?? 12));

        $propertyIds = $result->pluck('id');
        $consultCounts = Consult::whereIn('property_id', $propertyIds)
            ->selectRaw('property_id, count(*) as total')
            ->groupBy('property_id')
            ->pluck('total', 'property_id');

        return response()->json([
            'data' => $result->map(fn($p) => array_merge($this->formatProperty($p), [
                'inquiries' => $consultCounts[$p->id] ?? 0,
            ])),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function updateProperty(Request $request, int $id): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $property = Property::where('author_id', $agent->id)->findOrFail($id);

        $data = $request->validate([
            'name'            => 'sometimes|string|max:300',
            'type'            => 'sometimes|in:sale,rent',
            'description'     => 'nullable|string|max:400',
            'content'         => 'nullable|string',
            'location'        => 'nullable|string|max:255',
            'price'           => 'nullable|numeric|min:0',
            'number_bedroom'  => 'nullable|numeric|min:0',
            'number_bathroom' => 'nullable|numeric|min:0',
            'square'          => 'nullable|numeric|min:0',
            'status'          => 'nullable|in:selling,renting,pending,sold,rented',
            'is_featured'     => 'boolean',
            'city_id'         => 'nullable|integer',
            'images'          => 'nullable|array',
            'images.*'        => 'nullable|string',
            'category_ids'    => 'nullable|array',
        ]);

        $property->update($data);
        if (isset($data['category_ids'])) $property->categories()->sync($data['category_ids']);

        return response()->json(['data' => $this->formatProperty($property->fresh(['city', 'categories'])), 'error' => false, 'message' => 'Property updated.']);
    }

    public function projects(Request $request): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $query = Project::with(['city'])->where('author_id', $agent->id);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $result = $query->orderByDesc('created_at')->paginate((int)($request->per_page ?? 12));

        $projectIds = $result->pluck('id');
        $consultCounts = Consult::whereIn('project_id', $projectIds)
            ->selectRaw('project_id, count(*) as total')
            ->groupBy('project_id')
            ->pluck('total', 'project_id');

        return response()->json([
            'data' => $result->map(fn($p) => array_merge($this->formatProject($p), [
                'inquiries' => $consultCounts[$p->id] ?? 0,
            ])),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function updateProject(Request $request, int $id): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $project = Project::where('author_id', $agent->id)->findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|string|max:300',
            'description' => 'nullable|string|max:400',
            'content'     => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'price_from'  => 'nullable|numeric|min:0',
            'price_to'    => 'nullable|numeric|min:0',
            'status'      => 'nullable|in:selling,pending,completed',
            'city_id'     => 'nullable|integer',
            'images'      => 'nullable|array',
            'images.*'    => 'nullable|string',
        ]);

        $project->update($data);

        return response()->json(['data' => $this->formatProject($project->fresh(['city'])), 'error' => false, 'message' => 'Project updated.']);
    }

    public function messages(Request $request): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $propertyIds = Property::where('author_id', $agent->id)->pluck('id');
        $projectIds  = Project::where('author_id', $agent->id)->pluck('id');

        $query = Consult::with(['property:id,name', 'project:id,name'])
            ->where(function ($q) use ($propertyIds, $projectIds) {
                $q->whereIn('property_id', $propertyIds)->orWhereIn('project_id', $projectIds);
            });

        if ($request->filled('status')) $query->where('status', $request->status);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('phone', 'like', "%$s%")->orWhere('email', 'like', "%$s%"));
        }

        $result = $query->orderByDesc('created_at')->paginate((int)($request->per_page ?? 15));

        return response()->json([
            'data' => $result->items(),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $data = $request->validate([
            'first_name'  => 'sometimes|string|max:100',
            'last_name'   => 'sometimes|string|max:100',
            'email'       => 'sometimes|email|max:255',
            'phone'       => 'nullable|string|max:50',
            'whatsapp'    => 'nullable|string|max:50',
            'description' => 'nullable|string|max:1000',
            'city_id'     => 'nullable|integer',
        ]);

        $agent->update($data);

        $user = $request->user();
        $userUpdates = [];
        if (isset($data['first_name']) || isset($data['last_name'])) {
            $fn = $data['first_name'] ?? $agent->fresh()->first_name;
            $ln = $data['last_name']  ?? $agent->fresh()->last_name;
            $userUpdates['name'] = trim("$fn $ln");
        }
        if (isset($data['phone'])) $userUpdates['phone'] = $data['phone'];
        if (!empty($userUpdates)) $user->update($userUpdates);

        return response()->json(['data' => $this->formatAgent($agent->fresh()), 'error' => false, 'message' => 'Profile updated.']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $agent = $this->getAgent($request);
        if (!$agent) return response()->json(['error' => true, 'message' => 'No agent profile found.'], 403);

        $request->validate(['avatar' => 'required|image|max:4096']);

        $path = $request->file('avatar')->store('avatars', 'public');
        $agent->update(['avatar_id' => $path]);

        return response()->json(['data' => ['avatar_url' => "/storage/$path"], 'error' => false, 'message' => 'Avatar updated.']);
    }

    private function formatAgent(Agent $a): array
    {
        $avatar = $a->avatar_id;
        $avatarUrl = $avatar ? (str_starts_with($avatar, 'http') ? $avatar : "/storage/$avatar") : null;
        return [
            'id'          => $a->id,
            'first_name'  => $a->first_name,
            'last_name'   => $a->last_name,
            'name'        => $a->name,
            'email'       => $a->email,
            'phone'       => $a->phone,
            'whatsapp'    => $a->whatsapp,
            'description' => $a->description,
            'city_id'     => $a->city_id,
            'city'        => $a->city ? ['id' => $a->city->id, 'name' => $a->city->name] : null,
            'is_verified' => (bool) $a->is_verified,
            'is_featured' => (bool) $a->is_featured,
            'avatar_url'  => $avatarUrl,
        ];
    }

    private function formatProperty(Property $p): array
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
            'number_bedroom'    => (int) $p->number_bedroom,
            'number_bathroom'   => (int) $p->number_bathroom,
            'square'            => $p->square,
            'price'             => $p->price,
            'is_featured'       => (bool) $p->is_featured,
            'status'            => $p->status,
            'moderation_status' => $p->moderation_status,
            'city_id'           => $p->city_id,
            'city'              => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
            'categories'        => $p->categories ? $p->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->values() : [],
            'views'             => (int) $p->views,
            'created_at'        => $p->created_at,
        ];
    }

    private function formatProject(Project $p): array
    {
        $images = $p->images ?? [];
        if (is_string($images)) $images = json_decode($images, true) ?? [];
        return [
            'id'          => $p->id,
            'name'        => $p->name,
            'description' => $p->description,
            'location'    => $p->location,
            'images'      => $images,
            'city_id'     => $p->city_id,
            'city'        => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
            'price_from'  => $p->price_from,
            'price_to'    => $p->price_to,
            'is_featured' => (bool) $p->is_featured,
            'status'      => $p->status,
            'views'       => (int) $p->views,
            'created_at'  => $p->created_at,
        ];
    }
}
