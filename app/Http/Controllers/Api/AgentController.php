<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Project;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Agent::with(['city'])->withCount('properties');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%");
            });
        }

        if ($request->filled('is_featured')) {
            $query->where('is_featured', (bool) $request->is_featured);
        }

        $orderBy = in_array($request->order_by, ['created_at', 'first_name', 'last_name']) ? $request->order_by : 'created_at';
        $order   = $request->order === 'asc' ? 'asc' : 'desc';
        $query->orderBy($orderBy, $order);

        $perPage = min((int) ($request->per_page ?? 10), 100);
        $result  = $query->paginate($perPage);

        return response()->json([
            'data'  => $result->map(fn($a) => $this->formatAgent($a)),
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

    public function show(int $id): JsonResponse
    {
        $agent = Agent::with(['city'])->withCount('properties')->find($id);

        if (! $agent) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Agent not found'], 404);
        }

        return response()->json(['data' => $this->formatAgent($agent), 'error' => false, 'message' => null]);
    }

    public function properties(int $id): JsonResponse
    {
        $agent = Agent::find($id);

        if (! $agent) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Agent not found'], 404);
        }

        // Find the user account linked to this agent (has professional_agent_id = agent.id)
        $linkedUser = User::where('professional_agent_id', $agent->id)->first();

        $properties = Property::with(['city', 'slug'])
            ->where(function ($q) use ($agent, $linkedUser) {
                // Agent-authored listings
                $q->where(function ($inner) use ($agent) {
                    $inner->where('author_id', $agent->id)
                          ->where('author_type', Agent::class);
                });
                // Also include legacy listings submitted under the linked user account
                if ($linkedUser) {
                    $q->orWhere(function ($inner) use ($linkedUser) {
                        $inner->where('author_id', $linkedUser->id)
                              ->where('author_type', User::class);
                    });
                }
            })
            ->paginate(10);

        return response()->json([
            'data'    => $properties->items(),
            'meta'    => ['total' => $properties->total()],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function projects(int $id): JsonResponse
    {
        $agent = Agent::find($id);

        if (! $agent) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Agent not found'], 404);
        }

        $linkedUser = User::where('professional_agent_id', $agent->id)->first();

        $projects = Project::with(['city', 'slug'])
            ->where(function ($q) use ($agent, $linkedUser) {
                $q->where(function ($inner) use ($agent) {
                    $inner->where('author_id', $agent->id)
                          ->where('author_type', Agent::class);
                });
                if ($linkedUser) {
                    $q->orWhere(function ($inner) use ($linkedUser) {
                        $inner->where('author_id', $linkedUser->id)
                              ->where('author_type', User::class);
                    });
                }
            })
            ->paginate(10);

        return response()->json([
            'data'    => $projects->items(),
            'meta'    => ['total' => $projects->total()],
            'error'   => false,
            'message' => null,
        ]);
    }

    private function formatAgent(Agent $agent): array
    {
        $raw = $agent->avatar_id;
        $avatarUrl = $raw
            ? (str_starts_with($raw, 'http') || str_starts_with($raw, '/') ? $raw : "/storage/$raw")
            : null;

        return [
            'id'          => $agent->id,
            'name'        => $agent->name,
            'first_name'  => $agent->first_name,
            'last_name'   => $agent->last_name,
            'email'       => $agent->email,
            'phone'       => $agent->phone,
            'whatsapp'    => $agent->whatsapp,
            'description' => $agent->description,
            'avatar_url'  => $avatarUrl,
            'avatar'      => $avatarUrl,
            'is_featured' => $agent->is_featured,
            'is_verified' => $agent->is_verified,
            'properties_count' => $agent->properties_count ?? 0,
            'city'        => $agent->city ? ['id' => $agent->city->id, 'name' => $agent->city->name] : null,
            'created_at'  => $agent->created_at,
        ];
    }
}
