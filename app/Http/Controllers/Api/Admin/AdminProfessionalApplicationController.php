<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminProfessionalApplicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::whereNotNull('professional_status')
            ->where('professional_status', '!=', '');

        if ($request->filled('status')) {
            $query->where('professional_status', $request->status);
        } else {
            $query->where('professional_status', 'pending');
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('name', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%")
                  ->orWhere('professional_specialty', 'like', "%$s%")
            );
        }

        $result = $query->with('city')->orderBy('professional_applied_at', 'desc')
            ->paginate((int) ($request->per_page ?? 15));

        return response()->json([
            'data' => $result->map(fn($u) => $this->format($u)),
            'meta' => [
                'total'        => $result->total(),
                'last_page'    => $result->lastPage(),
                'current_page' => $result->currentPage(),
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $user = User::where('professional_status', 'pending')->findOrFail($id);

        $nameParts = explode(' ', $user->name, 2);
        $firstName = $nameParts[0];
        $lastName  = $nameParts[1] ?? '';

        $agent = Agent::create([
            'first_name'  => $firstName,
            'last_name'   => $lastName,
            'email'       => $user->email,
            'phone'       => $user->professional_phone ?? $user->phone,
            'whatsapp'    => $user->professional_phone ?? $user->phone,
            'description' => $user->professional_bio,
            'city_id'     => $user->professional_city_id,
            'is_verified' => true,
            'is_featured' => false,
            'verified_at' => now(),
            'password'    => Hash::make(Str::random(24)),
        ]);

        $user->update([
            'professional_status'   => 'approved',
            'account_type'          => 'professional',
            'professional_agent_id' => $agent->id,
        ]);

        return response()->json([
            'data'    => $this->format($user->fresh()),
            'error'   => false,
            'message' => 'Application approved. Agent profile created.',
        ]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $user = User::where('professional_status', 'pending')->findOrFail($id);

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $user->update([
            'professional_status'        => 'rejected',
            'professional_reject_reason' => $request->reason ?? 'Your application did not meet our requirements.',
        ]);

        return response()->json([
            'data'    => null,
            'error'   => false,
            'message' => 'Application rejected.',
        ]);
    }

    private function format(User $u): array
    {
        return [
            'id'                          => $u->id,
            'name'                        => $u->name,
            'email'                       => $u->email,
            'professional_status'         => $u->professional_status,
            'professional_bio'            => $u->professional_bio,
            'professional_specialty'      => $u->professional_specialty,
            'professional_experience_years' => $u->professional_experience_years,
            'professional_phone'          => $u->professional_phone,
            'professional_city_id'        => $u->professional_city_id,
            'city_name'                   => $u->city?->name,
            'professional_applied_at'     => $u->professional_applied_at,
            'professional_reject_reason'  => $u->professional_reject_reason,
            'company_name'                => $u->company_name,
            'license_number'             => $u->license_number,
        ];
    }
}
