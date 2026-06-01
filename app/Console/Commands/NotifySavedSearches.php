<?php

namespace App\Console\Commands;

use App\Mail\NewPropertyMatchMail;
use App\Models\Property;
use App\Models\SavedSearch;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NotifySavedSearches extends Command
{
    protected $signature   = 'mahalo:notify-saved-searches';
    protected $description = 'Check for new property matches and notify users by email.';

    public function handle(): int
    {
        $searches = SavedSearch::where('is_active', true)->get();
        $this->info("Checking {$searches->count()} saved searches…");

        $notified = 0;

        foreach ($searches as $search) {
            $prefs = $search->preferences;

            $query = Property::with(['city', 'slug'])
                ->where('status', 'published')
                ->where('moderation_status', 'approved');

            if ($search->last_notified_at) {
                $query->where('created_at', '>', $search->last_notified_at);
            } else {
                $query->where('created_at', '>', $search->created_at);
            }

            if (!empty($prefs['type'])) {
                $query->where('type', $prefs['type']);
            }

            if (!empty($prefs['city'])) {
                $query->whereHas('city', fn($q) => $q->where('name', 'like', '%' . $prefs['city'] . '%'));
            }

            if (!empty($prefs['max_price'])) {
                $query->where('price', '<=', $prefs['max_price']);
            }

            if (!empty($prefs['min_price'])) {
                $query->where('price', '>=', $prefs['min_price']);
            }

            if (!empty($prefs['min_bedrooms'])) {
                $query->where('number_bedroom', '>=', $prefs['min_bedrooms']);
            }

            $newProperties = $query->orderByDesc('created_at')->limit(10)->get();

            if ($newProperties->isNotEmpty()) {
                $props = $newProperties->map(fn($p) => [
                    'name'     => $p->name,
                    'type'     => $p->type,
                    'price'    => $p->price,
                    'city'     => $p->city?->name,
                    'bedrooms' => $p->number_bedroom,
                    'area'     => $p->square,
                    'slug'     => $p->slug?->key,
                    'image'    => $p->image,
                ])->toArray();

                try {
                    Mail::to($search->email)->send(new NewPropertyMatchMail($search, $props));
                    $search->update(['last_notified_at' => now()]);
                    $notified++;
                    $this->info("  ✓ Notified {$search->email} — {$newProperties->count()} new match(es)");
                } catch (\Throwable $e) {
                    $this->error("  ✗ Failed to notify {$search->email}: {$e->getMessage()}");
                }
            }
        }

        $this->info("Done. {$notified} notification(s) sent.");
        return Command::SUCCESS;
    }
}
