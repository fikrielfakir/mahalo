<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfessionalApplicationController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'data' => [
                'professional_status'           => $user->professional_status,
                'professional_bio'              => $user->professional_bio,
                'professional_specialty'        => $user->professional_specialty,
                'professional_experience_years' => $user->professional_experience_years,
                'professional_phone'            => $user->professional_phone,
                'professional_city_id'          => $user->professional_city_id,
                'professional_applied_at'       => $user->professional_applied_at,
                'professional_reject_reason'    => $user->professional_reject_reason,
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function apply(Request $request): JsonResponse
    {
        $user = $request->user();

        if (in_array($user->professional_status, ['pending', 'approved'])) {
            return response()->json([
                'data'    => null,
                'error'   => true,
                'message' => $user->professional_status === 'approved'
                    ? 'Your professional account is already approved.'
                    : 'Your application is already under review.',
            ], 422);
        }

        $data = $request->validate([
            'bio'              => 'required|string|min:50|max:1000',
            'specialty'        => 'required|string|max:120',
            'experience_years' => 'required|integer|min:0|max:60',
            'phone'            => 'required|string|max:30',
            'city_id'          => 'nullable|integer',
            'company_name'     => 'nullable|string|max:150',
            'license_number'   => 'nullable|string|max:100',
        ]);

        $user->update([
            'professional_status'           => 'pending',
            'professional_bio'              => $data['bio'],
            'professional_specialty'        => $data['specialty'],
            'professional_experience_years' => $data['experience_years'],
            'professional_phone'            => $data['phone'],
            'professional_city_id'          => $data['city_id'] ?? null,
            'professional_applied_at'       => now(),
            'professional_reject_reason'    => null,
            'company_name'                  => $data['company_name'] ?? $user->company_name,
            'license_number'                => $data['license_number'] ?? $user->license_number,
        ]);

        return response()->json([
            'data'    => null,
            'error'   => false,
            'message' => 'Application submitted. An admin will review it shortly.',
        ]);
    }
}
