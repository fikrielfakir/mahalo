<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PublicSettingsController extends Controller
{
    private const PUBLIC_KEYS = [
        'site_name', 'tagline', 'logo_url', 'footer_logo_url',
        'contact_email', 'contact_phone', 'address', 'whatsapp_number',
        'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url',
        'primary_color', 'secondary_color', 'accent_color',
        'seo_title', 'seo_description', 'google_analytics_id', 'currency',
        // Site mode
        'maintenance_mode', 'maintenance_message',
        'coming_soon_mode', 'coming_soon_date', 'coming_soon_message',
        // Content pages
        'page_about', 'page_privacy', 'page_terms',
        // Footer & SEO
        'footer_description', 'seo_keywords', 'google_site_verification',
        // Cookie consent
        'cookie_consent_enabled', 'cookie_consent_title', 'cookie_consent_message',
        'cookie_accept_text', 'cookie_decline_text', 'cookie_policy_url',
    ];

    public function show(): JsonResponse
    {
        $rows     = DB::table('site_settings')->whereIn('key', self::PUBLIC_KEYS)->get();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row->key] = $row->value;
        }
        return response()->json(['data' => $settings, 'error' => false, 'message' => null]);
    }
}
