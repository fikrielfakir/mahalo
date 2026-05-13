<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $rows = DB::table('site_settings')->get();

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row->key] = $row->value;
        }

        return response()->json(['data' => $settings, 'error' => false, 'message' => null]);
    }

    public function update(Request $request): JsonResponse
    {
        $allowed = [
            'site_name', 'tagline', 'contact_email', 'contact_phone',
            'address', 'facebook_url', 'instagram_url', 'twitter_url',
            'youtube_url', 'seo_title', 'seo_description',
            'google_analytics_id', 'whatsapp_number', 'currency',
            'properties_per_page',
        ];

        $data = $request->only($allowed);

        foreach ($data as $key => $value) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now(), 'created_at' => now()]
            );
        }

        // Return all settings after update
        $rows     = DB::table('site_settings')->get();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row->key] = $row->value;
        }

        return response()->json(['data' => $settings, 'error' => false, 'message' => 'Settings saved.']);
    }
}
