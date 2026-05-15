<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminAgentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Agent::with('city');
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('first_name', 'like', "%$s%")->orWhere('last_name', 'like', "%$s%")->orWhere('email', 'like', "%$s%"));
        }
        $result = $query->orderBy('created_at', 'desc')->paginate((int) ($request->per_page ?? 15));

        return response()->json([
            'data' => $result->map(fn($a) => $this->format($a)),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name'  => 'required|string|max:120',
            'last_name'   => 'required|string|max:120',
            'email'       => 'nullable|email|unique:re_accounts,email|max:255',
            'password'    => 'nullable|string|min:6',
            'phone'       => 'nullable|string|max:25',
            'whatsapp'    => 'nullable|string|max:25',
            'description' => 'nullable|string',
            'city_id'     => 'nullable|integer',
            'is_featured' => 'boolean',
            'is_verified' => 'boolean',
        ]);

        $agent = Agent::create([
            ...$data,
            'password' => Hash::make($data['password'] ?? Str::random(16)),
        ]);

        return response()->json(['data' => $this->format($agent->fresh('city')), 'error' => false, 'message' => 'Agent created.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $a = Agent::with('city')->findOrFail($id);
        return response()->json(['data' => $this->format($a), 'error' => false, 'message' => null]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $agent = Agent::findOrFail($id);
        $data = $request->validate([
            'first_name'  => 'sometimes|string|max:120',
            'last_name'   => 'sometimes|string|max:120',
            'email'       => "nullable|email|unique:re_accounts,email,$id|max:255",
            'phone'       => 'nullable|string|max:25',
            'whatsapp'    => 'nullable|string|max:25',
            'description' => 'nullable|string',
            'city_id'     => 'nullable|integer',
            'is_featured' => 'boolean',
            'is_verified' => 'boolean',
        ]);
        $agent->update($data);

        return response()->json(['data' => $this->format($agent->fresh('city')), 'error' => false, 'message' => 'Agent updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Agent::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Agent deleted.']);
    }

    public function ban(Request $request, int $id): JsonResponse
    {
        $agent = Agent::findOrFail($id);
        $data  = $request->validate(['reason' => 'nullable|string|max:500']);

        $agent->update(['is_banned' => true, 'ban_reason' => $data['reason'] ?? null]);

        // Also ban the linked user account if one exists
        $user = \App\Models\User::where('professional_agent_id', $id)->first();
        if ($user) {
            $user->update(['is_banned' => true, 'ban_reason' => $data['reason'] ?? null]);
            $user->tokens()->delete();
        }

        return response()->json(['data' => $this->format($agent->fresh('city')), 'error' => false, 'message' => 'Agent banned.']);
    }

    public function unban(int $id): JsonResponse
    {
        $agent = Agent::findOrFail($id);
        $agent->update(['is_banned' => false, 'ban_reason' => null]);

        $user = \App\Models\User::where('professional_agent_id', $id)->first();
        if ($user) {
            $user->update(['is_banned' => false, 'ban_reason' => null]);
        }

        return response()->json(['data' => $this->format($agent->fresh('city')), 'error' => false, 'message' => 'Agent unbanned.']);
    }

    private function format(Agent $a): array
    {
        return [
            'id'          => $a->id,
            'name'        => $a->name,
            'first_name'  => $a->first_name,
            'last_name'   => $a->last_name,
            'email'       => $a->email,
            'phone'       => $a->phone,
            'whatsapp'    => $a->whatsapp,
            'description' => $a->description,
            'city_id'     => $a->city_id,
            'city'        => $a->city ? ['id' => $a->city->id, 'name' => $a->city->name] : null,
            'is_featured' => (bool) $a->is_featured,
            'is_verified' => (bool) $a->is_verified,
            'is_banned'   => (bool) $a->is_banned,
            'ban_reason'  => $a->ban_reason,
            'created_at'  => $a->created_at,
        ];
    }
}
