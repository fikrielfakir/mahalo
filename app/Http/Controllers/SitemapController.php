<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Project;
use App\Models\Property;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SitemapController extends Controller
{
    private string $frontendUrl;
    private string $backendUrl;
    private const CACHE_TTL = 86400; // 24 hours

    public function __construct()
    {
        $this->frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5000'), '/');
        $this->backendUrl  = rtrim(env('APP_URL', 'http://localhost:8000'), '/');
    }

    public function index(): Response
    {
        $xml = Cache::remember('sitemap_index', self::CACHE_TTL, function () {
            $sitemaps = ['static', 'properties', 'projects', 'agents'];
            $today    = now()->format('Y-m-d');

            $items = '';
            foreach ($sitemaps as $type) {
                $items .= "  <sitemap>\n";
                $items .= "    <loc>{$this->frontendUrl}/sitemap-{$type}.xml</loc>\n";
                $items .= "    <lastmod>{$today}</lastmod>\n";
                $items .= "  </sitemap>\n";
            }

            return $this->xmlWrap('sitemapindex', $items,
                'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
        });

        return $this->xmlResponse($xml);
    }

    public function staticPages(): Response
    {
        $xml = Cache::remember('sitemap_static', self::CACHE_TTL, function () {
            $pages = [
                ['path' => '/',              'priority' => '1.0', 'freq' => 'daily'],
                ['path' => '/properties',    'priority' => '0.9', 'freq' => 'daily'],
                ['path' => '/projects',      'priority' => '0.8', 'freq' => 'weekly'],
                ['path' => '/neighborhoods', 'priority' => '0.7', 'freq' => 'weekly'],
                ['path' => '/agents',        'priority' => '0.7', 'freq' => 'weekly'],
                ['path' => '/about',         'priority' => '0.5', 'freq' => 'monthly'],
                ['path' => '/privacy',       'priority' => '0.3', 'freq' => 'monthly'],
                ['path' => '/terms',         'priority' => '0.3', 'freq' => 'monthly'],
            ];

            $urls = array_map(fn($p) => [
                'loc'        => $this->frontendUrl . $p['path'],
                'priority'   => $p['priority'],
                'changefreq' => $p['freq'],
            ], $pages);

            return $this->buildUrlset($urls);
        });

        return $this->xmlResponse($xml);
    }

    public function properties(): Response
    {
        $xml = Cache::remember('sitemap_properties', self::CACHE_TTL, function () {
            $urls = [];

            Property::with('slug')
                ->where('moderation_status', 'approved')
                ->whereNotIn('status', ['draft'])
                ->lazyById(200)
                ->each(function (Property $p) use (&$urls) {
                    $slug = $p->slug?->key ?? $p->id;
                    $urls[] = [
                        'loc'        => "{$this->frontendUrl}/properties/{$slug}",
                        'lastmod'    => $p->updated_at?->format('Y-m-d'),
                        'priority'   => '0.9',
                        'changefreq' => 'daily',
                        'image'      => $this->firstImage($p->images),
                    ];
                });

            return $this->buildUrlset($urls, withImage: true);
        });

        return $this->xmlResponse($xml);
    }

    public function projects(): Response
    {
        $xml = Cache::remember('sitemap_projects', self::CACHE_TTL, function () {
            $urls = [];

            Project::with('slug')
                ->where('status', 'published')
                ->lazyById(200)
                ->each(function (Project $p) use (&$urls) {
                    $slug = $p->slug?->key ?? $p->id;
                    $urls[] = [
                        'loc'        => "{$this->frontendUrl}/projects/{$slug}",
                        'lastmod'    => $p->updated_at?->format('Y-m-d'),
                        'priority'   => '0.8',
                        'changefreq' => 'weekly',
                        'image'      => $this->firstImage($p->images),
                    ];
                });

            return $this->buildUrlset($urls, withImage: true);
        });

        return $this->xmlResponse($xml);
    }

    public function agents(): Response
    {
        $xml = Cache::remember('sitemap_agents', self::CACHE_TTL, function () {
            $urls = [];

            Agent::where('is_verified', true)
                ->lazyById(200)
                ->each(function (Agent $a) use (&$urls) {
                    $urls[] = [
                        'loc'        => "{$this->frontendUrl}/agents/{$a->id}",
                        'lastmod'    => $a->updated_at?->format('Y-m-d'),
                        'priority'   => '0.7',
                        'changefreq' => 'weekly',
                    ];
                });

            return $this->buildUrlset($urls);
        });

        return $this->xmlResponse($xml);
    }

    public function ping(): Response
    {
        Cache::forget('sitemap_index');
        Cache::forget('sitemap_static');
        Cache::forget('sitemap_properties');
        Cache::forget('sitemap_projects');
        Cache::forget('sitemap_agents');

        $sitemapUrl = urlencode("{$this->frontendUrl}/sitemap.xml");
        $results    = [];

        foreach ([
            'google' => "https://www.google.com/ping?sitemap={$sitemapUrl}",
            'bing'   => "https://www.bing.com/ping?sitemap={$sitemapUrl}",
        ] as $engine => $url) {
            try {
                $res = Http::timeout(10)->get($url);
                $results[$engine] = $res->status();
            } catch (\Throwable $e) {
                Log::warning("Sitemap ping failed for {$engine}: " . $e->getMessage());
                $results[$engine] = 'error';
            }
        }

        return response()->json([
            'message' => 'Sitemap cache cleared and search engines pinged.',
            'results' => $results,
        ]);
    }

    private function buildUrlset(array $urls, bool $withImage = false): string
    {
        $ns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        if ($withImage) {
            $ns .= "\n        xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\"";
        }

        $items = '';
        foreach ($urls as $u) {
            $items .= "  <url>\n";
            $items .= "    <loc>" . htmlspecialchars($u['loc']) . "</loc>\n";
            if (!empty($u['lastmod'])) {
                $items .= "    <lastmod>{$u['lastmod']}</lastmod>\n";
            }
            $items .= "    <changefreq>{$u['changefreq']}</changefreq>\n";
            $items .= "    <priority>{$u['priority']}</priority>\n";
            if ($withImage && !empty($u['image'])) {
                $items .= "    <image:image>\n";
                $items .= "      <image:loc>" . htmlspecialchars($u['image']) . "</image:loc>\n";
                $items .= "    </image:image>\n";
            }
            $items .= "  </url>\n";
        }

        return $this->xmlWrap('urlset', $items, $ns);
    }

    private function xmlWrap(string $tag, string $content, string $attrs = ''): string
    {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<{$tag} {$attrs}>\n{$content}</{$tag}>";
    }

    private function firstImage(mixed $images): ?string
    {
        if (empty($images)) return null;
        if (is_string($images)) {
            $images = json_decode($images, true);
        }
        if (!is_array($images) || empty($images)) return null;
        $img = $images[0];
        if (!is_string($img) || empty($img)) return null;
        if (str_starts_with($img, 'http')) return $img;
        return "{$this->backendUrl}/storage/{$img}";
    }

    private function xmlResponse(string $xml): Response
    {
        return response($xml, 200, [
            'Content-Type'  => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
