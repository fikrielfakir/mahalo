<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = User::query();

        if ($s = $request->input('search')) {
            $q->where('name', 'like', "%{$s}%")
              ->orWhere('email', 'like', "%{$s}%");
        }

        $perPage = (int) $request->input('per_page', 15);
        $users   = $q->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data'  => $users->items(),
            'meta'  => [
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'in:admin,agent,viewer',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json(['data' => $user, 'error' => false, 'message' => 'User created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($id)],
            'password' => 'sometimes|nullable|string|min:8',
            'role'     => 'in:admin,agent,viewer',
        ]);

        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json(['data' => $user, 'error' => false, 'message' => 'User updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent deleting the last admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Cannot delete the last admin user.'], 422);
        }

        $user->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'User deleted.']);
    }

    public function ban(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['data' => null, 'error' => true, 'message' => 'Admin users cannot be banned.'], 422);
        }

        $data = $request->validate(['reason' => 'nullable|string|max:500']);

        $user->update(['is_banned' => true, 'ban_reason' => $data['reason'] ?? null]);
        $user->tokens()->delete();

        return response()->json(['data' => $user->fresh(), 'error' => false, 'message' => 'User banned.']);
    }

    public function unban(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['is_banned' => false, 'ban_reason' => null]);

        return response()->json(['data' => $user->fresh(), 'error' => false, 'message' => 'User unbanned.']);
    }
}
