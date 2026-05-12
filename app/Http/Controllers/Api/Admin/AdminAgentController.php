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
        $query = Agent::with('cityRelation');
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

        return response()->json(['data' => $this->format($agent->fresh('cityRelation')), 'error' => false, 'message' => 'Agent created.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $a = Agent::with('cityRelation')->findOrFail($id);
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

        return response()->json(['data' => $this->format($agent->fresh('cityRelation')), 'error' => false, 'message' => 'Agent updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Agent::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Agent deleted.']);
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
            'city'        => $a->cityRelation ? ['id' => $a->cityRelation->id, 'name' => $a->cityRelation->name] : null,
            'is_featured' => (bool) $a->is_featured,
            'is_verified' => (bool) $a->is_verified,
            'created_at'  => $a->created_at,
        ];
    }
}
