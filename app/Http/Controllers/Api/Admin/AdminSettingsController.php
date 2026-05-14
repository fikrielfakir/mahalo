<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        // SMTP Mail
        'mail_mailer', 'mail_host', 'mail_port', 'mail_username',
        'mail_password', 'mail_encryption', 'mail_from_address', 'mail_from_name',
        // Google OAuth
        'google_client_id', 'google_client_secret',
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

    public function testMail(Request $request): JsonResponse
    {
        $request->validate(['to' => 'required|email']);
        $to = $request->input('to');

        // Load mail settings from DB and override config at runtime
        $settings = DB::table('site_settings')
            ->whereIn('key', ['mail_mailer', 'mail_host', 'mail_port', 'mail_username', 'mail_password', 'mail_encryption', 'mail_from_address', 'mail_from_name'])
            ->pluck('value', 'key');

        if (!empty($settings['mail_host'])) {
            config([
                'mail.default'                       => $settings['mail_mailer'] ?? 'smtp',
                'mail.mailers.smtp.host'             => $settings['mail_host'],
                'mail.mailers.smtp.port'             => (int) ($settings['mail_port'] ?? 587),
                'mail.mailers.smtp.username'         => $settings['mail_username'] ?? null,
                'mail.mailers.smtp.password'         => $settings['mail_password'] ?? null,
                'mail.mailers.smtp.encryption'       => $settings['mail_encryption'] ?? 'tls',
                'mail.from.address'                  => $settings['mail_from_address'] ?? $settings['mail_username'] ?? $to,
                'mail.from.name'                     => $settings['mail_from_name'] ?? config('app.name'),
            ]);
        }

        try {
            Mail::raw('This is a test email from your Mahalo admin panel. Your SMTP configuration is working correctly.', function ($msg) use ($to, $settings) {
                $msg->to($to)
                    ->subject('Mahalo — SMTP Test Email')
                    ->from(
                        $settings['mail_from_address'] ?? $to,
                        $settings['mail_from_name'] ?? 'Mahalo'
                    );
            });

            return response()->json(['error' => false, 'message' => "Test email sent to {$to}."]);
        } catch (\Throwable $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 422);
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
