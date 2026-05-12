<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Agent::with(['city']);

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
        $agent = Agent::with(['city'])->find($id);

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

        $properties = $agent->properties()->with(['city', 'slug'])->paginate(10);

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

        $projects = $agent->projects()->with(['city', 'slug'])->paginate(10);

        return response()->json([
            'data'    => $projects->items(),
            'meta'    => ['total' => $projects->total()],
            'error'   => false,
            'message' => null,
        ]);
    }

    private function formatAgent(Agent $agent): array
    {
        return [
            'id'          => $agent->id,
            'name'        => $agent->name,
            'first_name'  => $agent->first_name,
            'last_name'   => $agent->last_name,
            'email'       => $agent->email,
            'phone'       => $agent->phone,
            'whatsapp'    => $agent->whatsapp,
            'description' => $agent->description,
            'avatar'      => $agent->avatar_id ? null : null,
            'is_featured' => $agent->is_featured,
            'is_verified' => $agent->is_verified,
            'city'        => $agent->city ? ['id' => $agent->city->id, 'name' => $agent->city->name] : null,
            'created_at'  => $agent->created_at,
        ];
    }
}
