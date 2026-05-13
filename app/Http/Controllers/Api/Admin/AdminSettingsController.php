<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminSettingsController extends Controller
{
    private const ALLOWED = [
        'site_name', 'tagline', 'contact_email', 'contact_phone',
        'address', 'whatsapp_number',
        'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url',
        'seo_title', 'seo_description', 'google_analytics_id',
        'currency', 'properties_per_page',
        // Theme
        'primary_color', 'secondary_color', 'accent_color',
        'logo_url', 'footer_logo_url',
        // Watermark
        'watermark_enabled', 'watermark_logo_url', 'watermark_position',
        'watermark_opacity', 'watermark_size',
    ];

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
        $data = $request->only(self::ALLOWED);

        foreach ($data as $key => $value) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value ?? '', 'updated_at' => now(), 'created_at' => now()]
            );
        }

        $rows     = DB::table('site_settings')->get();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row->key] = $row->value;
        }

        return response()->json(['data' => $settings, 'error' => false, 'message' => 'Settings saved.']);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|image|max:5120',
        ]);

        $file = $request->file('file');
        $ext  = $file->getClientOriginalExtension();
        $name = Str::uuid() . '.' . $ext;
        $path = $file->storeAs('logos', $name, 'public');
        $url  = Storage::disk('public')->url($path);

        return response()->json([
            'url'     => $url,
            'path'    => $path,
            'error'   => false,
            'message' => 'Logo uploaded.',
        ]);
    }
}
