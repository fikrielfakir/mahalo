<?php

namespace App\Http\Controllers\Api;

use App\Models\SavedSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SavedSearchController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'       => 'required|email|max:255',
            'name'        => 'nullable|string|max:255',
            'description' => 'required|string|max:2000',
            'preferences' => 'required|array',
        ]);

        $saved = SavedSearch::create($data);

        return response()->json([
            'saved' => true,
            'id'    => $saved->id,
            'message' => 'Recherche sauvegardée ! Vous recevrez un email quand de nouveaux biens correspondent.',
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $searches = SavedSearch::where('email', $request->query('email'))
            ->where('is_active', true)
            ->latest()
            ->get(['id', 'name', 'description', 'preferences', 'created_at', 'last_notified_at']);

        return response()->json(['searches' => $searches]);
    }

    public function destroy(int $id): JsonResponse
    {
        $search = SavedSearch::findOrFail($id);
        $search->update(['is_active' => false]);

        return response()->json(['deleted' => true]);
    }
}
