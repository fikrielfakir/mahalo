<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
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
        // Google OAuth
        'google_client_id', 'google_client_secret',
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
        // AI
        'groq_api_key', 'ai_model',
        // Mobile App Section
        'mobile_app_enabled', 'mobile_app_title', 'mobile_app_subtitle',
        'mobile_app_description', 'mobile_app_appstore_url', 'mobile_app_playstore_url',
        // Property type & projects toggles
        'sale_enabled', 'rent_enabled', 'projects_enabled',
    ];

    public function show(): JsonResponse
    {
        $rows = DB::table('site_settings')->get();

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row->key] = $row->value;
        }

        return response()->json(['data' => (object) $settings, 'error' => false, 'message' => null]);
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

    public function testMail(Request $request): JsonResponse
    {
        $request->validate(['to' => 'required|email']);
        $to = $request->input('to');

        try {
            Mail::raw('This is a test email from your Mahalo admin panel. Your SMTP configuration is working correctly.', function ($msg) use ($to) {
                $msg->to($to)
                    ->subject('Mahalo — SMTP Test Email')
                    ->from(
                        config('mail.from.address'),
                        config('mail.from.name')
                    );
            });

            return response()->json(['error' => false, 'message' => "Test email sent to {$to}."]);
        } catch (\Throwable $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 422);
        }
    }

    public function sitemapPing(): JsonResponse
    {
        $siteUrl = rtrim(config('app.url', url('/')), '/');
        $sitemapUrl = urlencode($siteUrl . '/sitemap.xml');

        $engines = [
            'Google' => "https://www.google.com/ping?sitemap={$sitemapUrl}",
            'Bing'   => "https://www.bing.com/ping?sitemap={$sitemapUrl}",
        ];

        $results = [];
        foreach ($engines as $name => $url) {
            try {
                $res = Http::timeout(8)->get($url);
                $results[$name] = $res->successful() ? 'ok' : 'error (' . $res->status() . ')';
            } catch (\Throwable $e) {
                $results[$name] = 'failed: ' . $e->getMessage();
            }
        }

        return response()->json([
            'data'    => ['results' => $results, 'sitemap_url' => $siteUrl . '/sitemap.xml'],
            'error'   => false,
            'message' => 'Sitemap pinged.',
        ]);
    }

    public function autoTranslate(Request $request): JsonResponse
    {
        $request->validate([
            'locale' => 'required|string|in:en,fr,es,ar',
            'keys'   => 'required|array|min:1',
        ]);

        $locale = $request->input('locale');
        $keys   = $request->input('keys');

        $localeNames = [
            'en' => 'English',
            'fr' => 'French',
            'es' => 'Spanish',
            'ar' => 'Arabic',
        ];
        $localeName = $localeNames[$locale] ?? $locale;

        $settings = DB::table('site_settings')
            ->whereIn('key', ['groq_api_key', 'ai_model'])
            ->pluck('value', 'key')
            ->toArray();

        $apiKey = $settings['groq_api_key'] ?? env('GROQ_API_KEY', '');
        $model  = ($settings['ai_model'] ?? '') ?: 'llama-3.3-70b-versatile';

        if (!$apiKey) {
            return response()->json(['error' => true, 'message' => 'Groq API key is not configured. Please set it in the AI tab.'], 422);
        }

        $inputJson = json_encode($keys, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $prompt = <<<EOT
Translate the following JSON values into {$localeName}. Return ONLY a valid JSON object with exactly the same keys but with translated values. Do not add any explanation, markdown, or code fences.

Input:
{$inputJson}
EOT;

        try {
            $response = Http::withToken($apiKey)
                ->timeout(30)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => $model,
                    'messages'    => [
                        ['role' => 'system', 'content' => "You are a professional translator. Translate text into {$localeName}. Return only valid JSON with the same keys."],
                        ['role' => 'user',   'content' => $prompt],
                    ],
                    'max_tokens'  => 1000,
                    'temperature' => 0.3,
                ]);

            if (!$response->successful()) {
                return response()->json(['error' => true, 'message' => 'Groq API error: ' . $response->body()], 500);
            }

            $raw     = $response->json('choices.0.message.content', '');
            $cleaned = preg_replace('/^```(?:json)?\s*/i', '', trim($raw));
            $cleaned = preg_replace('/\s*```$/', '', $cleaned);
            $result  = json_decode($cleaned, true);

            if (!is_array($result)) {
                return response()->json(['error' => true, 'message' => 'Could not parse translation response.'], 500);
            }

            return response()->json(['data' => $result, 'error' => false, 'message' => null]);
        } catch (\Throwable $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
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
