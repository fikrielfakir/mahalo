<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MarketInsightsController extends Controller
{
    public function index(): JsonResponse
    {
        $cityStats = DB::table('re_properties as p')
            ->join('cities as c', 'p.city_id', '=', 'c.id')
            ->where('p.moderation_status', 'approved')
            ->whereNotIn('p.status', ['draft'])
            ->whereNotNull('p.city_id')
            ->where('p.price', '>', 0)
            ->select(
                'c.id as city_id',
                'c.name as city_name',
                DB::raw('COUNT(*) as total_listings'),
                DB::raw('AVG(p.price) as avg_price'),
                DB::raw('MIN(p.price) as min_price'),
                DB::raw('MAX(p.price) as max_price'),
                DB::raw("SUM(CASE WHEN p.type = 'sale' THEN 1 ELSE 0 END) as for_sale"),
                DB::raw("SUM(CASE WHEN p.type = 'rent' THEN 1 ELSE 0 END) as for_rent")
            )
            ->groupBy('c.id', 'c.name')
            ->orderByDesc('total_listings')
            ->limit(10)
            ->get();

        $global = DB::table('re_properties')
            ->where('moderation_status', 'approved')
            ->whereNotIn('status', ['draft'])
            ->where('price', '>', 0)
            ->selectRaw('COUNT(*) as total_properties, AVG(price) as global_avg_price')
            ->first();

        $totalAgents = DB::table('re_accounts')->count();

        $cities = $cityStats->map(function ($row) {
            return [
                'city_id'        => $row->city_id,
                'city_name'      => $row->city_name,
                'total_listings' => (int)   $row->total_listings,
                'avg_price'      => round((float) $row->avg_price),
                'min_price'      => round((float) $row->min_price),
                'max_price'      => round((float) $row->max_price),
                'for_sale'       => (int)   $row->for_sale,
                'for_rent'       => (int)   $row->for_rent,
            ];
        });

        return response()->json([
            'data' => [
                'cities'           => $cities,
                'total_properties' => (int)   ($global->total_properties ?? 0),
                'global_avg_price' => round((float) ($global->global_avg_price ?? 0)),
                'total_agents'     => (int)   $totalAgents,
            ],
            'error'   => false,
            'message' => null,
        ]);
    }
}
