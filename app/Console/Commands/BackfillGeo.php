<?php

namespace App\Console\Commands;

use App\Models\PageView;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class BackfillGeo extends Command
{
    protected $signature = 'analytics:backfill-geo
                            {--limit=0 : Max rows to process (0 = all)}
                            {--dry-run : Show what would be updated without writing}';

    protected $description = 'Back-fill country / city for page_views rows that have no geo data.';

    // ip-api.com free tier: 45 requests / minute
    private const BATCH_SLEEP_MS = 1500; // ~40 req/min — safe margin
    private const HTTP_TIMEOUT   = 3;

    private array $countryMap = [
        'US' => 'United States', 'GB' => 'United Kingdom', 'FR' => 'France',
        'DE' => 'Germany', 'CA' => 'Canada', 'AU' => 'Australia',
        'IN' => 'India', 'BR' => 'Brazil', 'JP' => 'Japan', 'CN' => 'China',
        'MA' => 'Morocco', 'DZ' => 'Algeria', 'TN' => 'Tunisia', 'EG' => 'Egypt',
        'SA' => 'Saudi Arabia', 'AE' => 'UAE', 'TR' => 'Turkey', 'ID' => 'Indonesia',
        'RU' => 'Russia', 'MX' => 'Mexico', 'ES' => 'Spain', 'IT' => 'Italy',
        'NL' => 'Netherlands', 'SE' => 'Sweden', 'NO' => 'Norway', 'CH' => 'Switzerland',
        'BE' => 'Belgium', 'PL' => 'Poland', 'PT' => 'Portugal', 'GR' => 'Greece',
        'ZA' => 'South Africa', 'NG' => 'Nigeria', 'KE' => 'Kenya', 'GH' => 'Ghana',
        'PK' => 'Pakistan', 'BD' => 'Bangladesh', 'PH' => 'Philippines',
        'VN' => 'Vietnam', 'TH' => 'Thailand', 'MY' => 'Malaysia', 'SG' => 'Singapore',
        'KR' => 'South Korea', 'HK' => 'Hong Kong', 'TW' => 'Taiwan', 'NZ' => 'New Zealand',
        'AR' => 'Argentina', 'CO' => 'Colombia', 'CL' => 'Chile', 'PE' => 'Peru',
        'LY' => 'Libya', 'SD' => 'Sudan', 'IQ' => 'Iraq', 'SY' => 'Syria',
        'JO' => 'Jordan', 'LB' => 'Lebanon', 'KW' => 'Kuwait', 'QA' => 'Qatar',
        'OM' => 'Oman', 'BH' => 'Bahrain', 'YE' => 'Yemen',
    ];

    public function handle(): int
    {
        $limit  = (int) $this->option('limit');
        $dryRun = (bool) $this->option('dry-run');

        if ($dryRun) {
            $this->warn('DRY RUN — no data will be written.');
        }

        // Collect distinct public IPs that have at least one row with no country
        $query = DB::table('page_views')
            ->whereNull('country')
            ->whereNotNull('ip_address')
            ->select('ip_address')
            ->distinct();

        $ips = $query->pluck('ip_address')
            ->filter(fn ($ip) => filter_var(
                $ip,
                FILTER_VALIDATE_IP,
                FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
            ))
            ->values();

        if ($limit > 0) {
            $ips = $ips->take($limit);
        }

        $total   = $ips->count();
        $updated = 0;
        $skipped = 0;
        $failed  = 0;

        $this->info("Found {$total} distinct public IPs with missing geo data.");

        if ($total === 0) {
            $this->info('Nothing to do.');
            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($total);
        $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% — %message%');
        $bar->setMessage('starting…');
        $bar->start();

        foreach ($ips as $ip) {
            $bar->setMessage($ip);

            $geo = $this->lookupGeo($ip);

            if ($geo === null) {
                $failed++;
                $bar->advance();
                usleep(self::BATCH_SLEEP_MS * 1000);
                continue;
            }

            if ($geo['country'] === null && $geo['city'] === null) {
                $skipped++;
                $bar->advance();
                continue;
            }

            if (!$dryRun) {
                DB::table('page_views')
                    ->where('ip_address', $ip)
                    ->whereNull('country')
                    ->update([
                        'country'      => $geo['country'],
                        'country_code' => $geo['country_code'],
                        'city'         => $geo['city'],
                        'updated_at'   => now(),
                    ]);
            } else {
                $this->line('');
                $this->line("  [{$ip}] → {$geo['country']} / {$geo['city']}");
            }

            $updated++;
            $bar->advance();

            // Polite delay so we stay under ip-api.com free-tier cap
            usleep(self::BATCH_SLEEP_MS * 1000);
        }

        $bar->setMessage('done');
        $bar->finish();
        $this->newLine(2);

        $this->table(
            ['Metric', 'Count'],
            [
                ['IPs processed', $total],
                ['Rows updated',  $dryRun ? "{$updated} (dry run)" : $updated],
                ['Skipped (private/no result)', $skipped],
                ['API errors', $failed],
            ]
        );

        return self::SUCCESS;
    }

    private function lookupGeo(string $ip): ?array
    {
        // Re-use the same cache key as TrackPageView middleware
        return Cache::remember("geo:{$ip}", 86400, function () use ($ip) {
            try {
                $ctx = stream_context_create(['http' => ['timeout' => self::HTTP_TIMEOUT]]);
                $raw = @file_get_contents(
                    "http://ip-api.com/json/{$ip}?fields=status,country,countryCode,city",
                    false,
                    $ctx
                );

                if (!$raw) {
                    return null;
                }

                $data = json_decode($raw, true);

                if (($data['status'] ?? '') !== 'success') {
                    return ['country' => null, 'country_code' => null, 'city' => null];
                }

                $code = $data['countryCode'] ?? null;

                return [
                    'country'      => ($code && isset($this->countryMap[$code]))
                                      ? $this->countryMap[$code]
                                      : ($data['country'] ?? null),
                    'country_code' => $code,
                    'city'         => $data['city'] ?? null,
                ];
            } catch (\Throwable) {
                return null;
            }
        });
    }
}
