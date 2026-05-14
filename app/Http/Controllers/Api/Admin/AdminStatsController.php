<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Consult;
use App\Models\Project;
use App\Models\Property;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = [
            'properties'        => Property::count(),
            'properties_active' => Property::where('status', 'selling')->count(),
            'projects'          => Project::count(),
            'agents'            => Agent::count(),
            'consults'          => Consult::count(),
            'consults_unread'   => Consult::where('status', 'unread')->count(),
            'featured_properties' => Property::where('is_featured', true)->count(),
        ];

        $recent_properties = Property::with('city')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id'     => $p->id,
                'name'   => $p->name,
                'price'  => $p->price,
                'type'   => $p->type,
                'status' => $p->status,
                'city'   => $p->city?->name,
                'created_at' => $p->created_at,
            ]);

        $recent_consults = Consult::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'     => $c->id,
                'name'   => $c->name,
                'email'  => $c->email,
                'phone'  => $c->phone,
                'status' => $c->status,
                'created_at' => $c->created_at,
            ]);

        return response()->json([
            'data' => compact('stats', 'recent_properties', 'recent_consults'),
            'error' => false,
            'message' => null,
        ]);
    }
}
