<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $total_views    = PageView::where('created_at', '>=', $from)->where('is_bot', false)->count();
        $unique_visitors= PageView::where('created_at', '>=', $from)->where('is_bot', false)->distinct('session_id')->count('session_id');
        $unique_ips     = PageView::where('created_at', '>=', $from)->where('is_bot', false)->distinct('ip_address')->count('ip_address');
        $bot_views      = PageView::where('created_at', '>=', $from)->where('is_bot', true)->count();

        $prev_from  = now()->subDays($days * 2)->startOfDay();
        $prev_to    = now()->subDays($days)->startOfDay();
        $prev_views = PageView::whereBetween('created_at', [$prev_from, $prev_to])->where('is_bot', false)->count();
        $prev_uniq  = PageView::whereBetween('created_at', [$prev_from, $prev_to])->where('is_bot', false)->distinct('session_id')->count('session_id');

        $views_change   = $prev_views  > 0 ? round((($total_views - $prev_views) / $prev_views) * 100, 1) : null;
        $uniq_change    = $prev_uniq   > 0 ? round((($unique_visitors - $prev_uniq) / $prev_uniq) * 100, 1) : null;

        return response()->json([
            'data' => [
                'total_views'      => $total_views,
                'unique_visitors'  => $unique_visitors,
                'unique_ips'       => $unique_ips,
                'bot_views'        => $bot_views,
                'views_change'     => $views_change,
                'uniq_change'      => $uniq_change,
            ],
            'error' => false,
        ]);
    }

    public function timeSeries(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $isSqlite = config('database.default') === 'sqlite';
        $dateFn   = $isSqlite
            ? DB::raw("strftime('%Y-%m-%d', created_at) as date")
            : DB::raw("DATE(created_at) as date");

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->select(
                $dateFn,
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT session_id) as visitors')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $allDates = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $allDates[now()->subDays($i)->format('Y-m-d')] = ['date' => now()->subDays($i)->format('Y-m-d'), 'views' => 0, 'visitors' => 0];
        }
        foreach ($rows as $r) {
            if (isset($allDates[$r->date])) {
                $allDates[$r->date]['views']    = (int) $r->views;
                $allDates[$r->date]['visitors'] = (int) $r->visitors;
            }
        }

        return response()->json(['data' => array_values($allDates), 'error' => false]);
    }

    public function topPages(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->select('page', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('page')
            ->orderByDesc('views')
            ->limit(20)
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function countries(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->whereNotNull('country')
            ->select('country', 'country_code', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('country', 'country_code')
            ->orderByDesc('views')
            ->limit(20)
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function devices(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->select('device_type', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('device_type')
            ->orderByDesc('views')
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function browsers(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->select('browser', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('browser')
            ->orderByDesc('views')
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function os(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->select('os', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('os')
            ->orderByDesc('views')
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function cities(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days)->startOfDay();

        $rows = PageView::where('created_at', '>=', $from)
            ->where('is_bot', false)
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->select('city', 'country', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('city', 'country')
            ->orderByDesc('views')
            ->limit(20)
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function recentVisitors(Request $request): JsonResponse
    {
        $rows = PageView::where('is_bot', false)
            ->select('id', 'ip_address', 'page', 'country', 'country_code', 'city', 'device_type', 'browser', 'os', 'referrer', 'created_at')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function liveVisitors(): JsonResponse
    {
        $since = now()->subMinutes(5);

        $count = PageView::where('is_bot', false)
            ->where('created_at', '>=', $since)
            ->distinct('session_id')
            ->count('session_id');

        $pages = PageView::where('is_bot', false)
            ->where('created_at', '>=', $since)
            ->select('page', DB::raw('COUNT(DISTINCT session_id) as visitors'))
            ->groupBy('page')
            ->orderByDesc('visitors')
            ->limit(5)
            ->get();

        return response()->json([
            'data'  => ['count' => $count, 'active_pages' => $pages],
            'error' => false,
        ]);
    }
}
