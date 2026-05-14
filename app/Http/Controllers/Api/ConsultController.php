<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConsultController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:120',
            'email'       => 'nullable|email|max:255',
            'phone'       => 'nullable|string|max:255',
            'content'     => 'nullable|string',
            'property_id' => 'nullable|integer',
            'project_id'  => 'nullable|integer',
            'agent_id'    => 'nullable|integer',
        ]);

        $consult = Consult::create([
            ...$validated,
            'ip_address' => $request->ip(),
            'status'     => 'unread',
        ]);

        return response()->json([
            'data'    => $consult,
            'error'   => false,
            'message' => 'Consultation request submitted successfully.',
        ], 201);
    }

    public function customFields(): JsonResponse
    {
        return response()->json([
            'data'    => [],
            'error'   => false,
            'message' => null,
        ]);
    }
}
