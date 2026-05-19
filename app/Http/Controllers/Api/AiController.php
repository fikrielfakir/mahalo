<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    private string $groqBase = 'https://api.groq.com/openai/v1';
    private string $defaultModel = 'llama-3.3-70b-versatile';

    private function getSettings(): array
    {
        $rows = DB::table('site_settings')
            ->whereIn('key', ['groq_api_key', 'ai_model'])
            ->pluck('value', 'key')
            ->toArray();

        return $rows;
    }

    private function chat(array $messages, int $maxTokens = 800): string
    {
        $settings = $this->getSettings();

        $key   = $settings['groq_api_key'] ?? env('GROQ_API_KEY');
        $model = ($settings['ai_model'] ?? '') ?: $this->defaultModel;

        if (!$key) {
            throw new \RuntimeException('GROQ_API_KEY is not configured.');
        }

        $response = Http::withToken($key)
            ->timeout(30)
            ->post("{$this->groqBase}/chat/completions", [
                'model'       => $model,
                'messages'    => $messages,
                'max_tokens'  => $maxTokens,
                'temperature' => 0.7,
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Groq API error: ' . $response->body());
        }

        return $response->json('choices.0.message.content', '');
    }

    public function valuation(Request $request): JsonResponse
    {
        $request->validate([
            'type'      => 'required|string',
            'area'      => 'required|numeric',
            'bedrooms'  => 'nullable|numeric',
            'bathrooms' => 'nullable|numeric',
            'city'      => 'required|string',
            'location'  => 'nullable|string',
            'condition' => 'nullable|string',
            'age'       => 'nullable|string',
            'features'  => 'nullable|string',
        ]);

        $type      = $request->type;
        $area      = $request->area;
        $bedrooms  = $request->bedrooms  ?? 'N/A';
        $bathrooms = $request->bathrooms ?? 'N/A';
        $city      = $request->city;
        $location  = $request->location  ?? 'N/A';
        $condition = $request->condition ?? 'N/A';
        $age       = $request->age       ?? 'N/A';
        $features  = $request->features  ?? 'None';

        $prompt = <<<EOT
You are an expert real estate valuation analyst for the Moroccan property market (Mahalo platform).

Given the following property details:
Type: {$type}
Area: {$area} m²
Bedrooms: {$bedrooms}
Bathrooms: {$bathrooms}
City: {$city}
Location/neighborhood: {$location}
Condition: {$condition}
Age: {$age}
Features/amenities: {$features}

Please provide:
1. **Estimated Price Range** — Give a realistic MAD price range based on current Moroccan market conditions for this city/area.
2. **Price per m²** — Estimated range in MAD/m².
3. **Market Position** — Brief note on how this property compares to similar listings (below market, fair, premium).
4. **Key Value Drivers** — 2–3 bullet points on what most impacts the valuation.
5. **Investment Outlook** — Short 2-sentence outlook on rental yield or resale potential.

Be concise, data-driven, and formatted clearly. Use MAD as currency. If data is insufficient, provide ranges and note what additional info would sharpen the estimate.
EOT;

        try {
            $result = $this->chat([
                ['role' => 'system', 'content' => 'You are a Moroccan real estate valuation expert. Be concise and data-driven.'],
                ['role' => 'user',   'content' => $prompt],
            ], 600);

            return response()->json(['result' => $result]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function generateDescription(Request $request): JsonResponse
    {
        $request->validate([
            'name'       => 'required|string',
            'type'       => 'required|string',
            'area'       => 'nullable|numeric',
            'bedrooms'   => 'nullable|numeric',
            'bathrooms'  => 'nullable|numeric',
            'city'       => 'nullable|string',
            'location'   => 'nullable|string',
            'condition'  => 'nullable|string',
            'price'      => 'nullable|numeric',
            'features'   => 'nullable|string',
            'tone'       => 'nullable|string',
            'language'   => 'nullable|string',
        ]);

        $name      = $request->name;
        $type      = $request->type;
        $area      = $request->area      ?? 'N/A';
        $bedrooms  = $request->bedrooms  ?? 'N/A';
        $bathrooms = $request->bathrooms ?? 'N/A';
        $city      = $request->city      ?? 'Morocco';
        $location  = $request->location  ?? '';
        $condition = $request->condition ?? '';
        $price     = $request->price     ? number_format($request->price, 0, '.', ' ') . ' MAD' : 'Price on request';
        $features  = $request->features  ?? 'None';
        $tone      = $request->tone      ?? 'luxury and prestigious, targeting high-net-worth buyers';
        $language  = $request->language  ?? 'French';

        $neighborhood = $location ? "Neighborhood: {$location}" : '';
        $cond         = $condition ? "Condition: {$condition}" : '';

        $prompt = <<<EOT
You are a professional real estate copywriter for Mahalo, Morocco's premium real estate platform.

Write a compelling property listing description in **{$language}** with a **{$tone}** tone.

Property details:
Name: {$name}
Type: {$type}
Area: {$area} m²
Bedrooms: {$bedrooms}
Bathrooms: {$bathrooms}
City: {$city}
{$neighborhood}
{$cond}
Amenities: {$features}
Price: {$price}

Requirements:
- Write 2–3 paragraphs (150–250 words total)
- Start with a captivating opening sentence
- Highlight the key selling points naturally within the text
- End with a subtle call to action
- Sound authentic and human, not like AI-generated filler
- Do NOT include headers or bullet points — flowing prose only
- Tailor vocabulary and style to the Moroccan real estate market

Return only the description text, nothing else.
EOT;

        try {
            $result = $this->chat([
                ['role' => 'system', 'content' => 'You are an expert Moroccan real estate copywriter. Write in the requested language only.'],
                ['role' => 'user',   'content' => $prompt],
            ], 500);

            return response()->json(['description' => $result]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function propertyChat(Request $request): JsonResponse
    {
        $request->validate([
            'message'  => 'required|string|max:1000',
            'history'  => 'nullable|array',
            'property' => 'required|array',
        ]);

        $p       = $request->property;
        $name    = $p['name']      ?? 'N/A';
        $type    = $p['type']      ?? 'N/A';
        $price   = isset($p['price']) ? number_format($p['price'], 0, '.', ' ') . ' MAD' : 'Price on request';
        $area    = $p['square']    ?? 'N/A';
        $beds    = $p['number_bedroom']  ?? 'N/A';
        $baths   = $p['number_bathroom'] ?? 'N/A';
        $city    = $p['city']['name']    ?? 'N/A';
        $loc     = $p['location']  ?? 'N/A';
        $cond    = $p['condition'] ?? 'N/A';
        $age     = $p['age_range'] ?? 'N/A';
        $agent   = $p['agent']['name'] ?? 'a Mahalo agent';
        $cats    = collect($p['categories'] ?? [])->pluck('name')->join(', ') ?: 'N/A';
        $feats   = collect($p['features'] ?? [])->pluck('name')->join(', ') ?: 'N/A';

        $system = <<<EOT
You are Mahalo AI, a smart real estate assistant for Mahalo — Morocco's premier property platform. You help buyers, renters, and investors find and understand properties in Morocco.

The user is viewing this specific property:
Name: {$name}
Type: {$type}
Price: {$price}
Area: {$area} m²
Bedrooms: {$beds}
Bathrooms: {$baths}
City: {$city}
Location: {$loc}
Condition: {$cond}
Age: {$age}
Amenities: {$feats}
Categories: {$cats}
Listed by: {$agent}

Answer questions about this property specifically, as well as related topics (neighborhood, similar properties, buying process in Morocco, mortgage options, etc.). Be helpful, warm, and concise. Always respond in the same language the user writes in (French, English, or Arabic). If asked about things you don't know, say so honestly and suggest contacting {$agent} directly through Mahalo.
EOT;

        $messages = [['role' => 'system', 'content' => $system]];

        foreach (($request->history ?? []) as $h) {
            if (isset($h['role'], $h['content'])) {
                $messages[] = ['role' => $h['role'], 'content' => $h['content']];
            }
        }

        $messages[] = ['role' => 'user', 'content' => $request->message];

        try {
            $reply = $this->chat($messages, 400);
            return response()->json(['reply' => $reply]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function matchProperties(Request $request): JsonResponse
    {
        $request->validate([
            'history' => 'required|array|min:1',
        ]);

        // Step 1: extract structured preferences from conversation
        $convo = collect($request->history)
            ->map(fn($m) => "{$m['role']}: {$m['content']}")
            ->join("\n");

        $extractPrompt = <<<EOT
From the following conversation between a user and a real estate assistant, extract the user's property preferences as a JSON object.

Conversation:
{$convo}

Return ONLY a valid JSON object (no explanation, no markdown) with these optional fields:
{
  "type": "sale" or "rent" or null,
  "city": city name string or null,
  "min_price": number in MAD or null,
  "max_price": number in MAD or null,
  "min_bedrooms": number or null,
  "min_bathrooms": number or null,
  "min_area": number in m² or null,
  "max_area": number in m² or null,
  "features": array of feature keywords (e.g. ["parking","pool","balcony"]) or [],
  "condition": "New development" or "Resale" or "Off-plan" or null,
  "ready": true if enough info to search (at least city or type or price range), false otherwise,
  "missing": short human-friendly question to ask if not ready yet (in the same language the user is using)
}
EOT;

        try {
            $raw = $this->chat([
                ['role' => 'system', 'content' => 'Extract structured property preferences from conversations. Return only valid JSON.'],
                ['role' => 'user',   'content' => $extractPrompt],
            ], 300);

            // Strip markdown fences if present
            $json = preg_replace('/^```(?:json)?\s*/i', '', trim($raw));
            $json = preg_replace('/\s*```$/', '', $json);
            $prefs = json_decode($json, true);

            if (!$prefs) {
                return response()->json(['ready' => false, 'missing' => 'Could you tell me more about what you\'re looking for?']);
            }

            if (empty($prefs['ready'])) {
                return response()->json(['ready' => false, 'missing' => $prefs['missing'] ?? 'What type of property are you looking for?']);
            }

            // Step 2: query the database
            $query = \App\Models\Property::with(['city', 'features', 'categories', 'agent', 'slug'])
                ->whereIn('status', ['selling', 'renting'])
                ->where('moderation_status', 'approved');

            if (!empty($prefs['type'])) {
                $query->where('type', $prefs['type']);
            }

            if (!empty($prefs['city'])) {
                $query->whereHas('city', fn($q) => $q->where('name', 'like', '%' . $prefs['city'] . '%'));
            }

            if (!empty($prefs['min_price'])) {
                $query->where('price', '>=', $prefs['min_price']);
            }

            if (!empty($prefs['max_price'])) {
                $query->where('price', '<=', $prefs['max_price']);
            }

            if (!empty($prefs['min_bedrooms'])) {
                $query->where('number_bedroom', '>=', $prefs['min_bedrooms']);
            }

            if (!empty($prefs['min_bathrooms'])) {
                $query->where('number_bathroom', '>=', $prefs['min_bathrooms']);
            }

            if (!empty($prefs['min_area'])) {
                $query->where('square', '>=', $prefs['min_area']);
            }

            if (!empty($prefs['max_area'])) {
                $query->where('square', '<=', $prefs['max_area']);
            }

            if (!empty($prefs['condition'])) {
                $query->where('condition', $prefs['condition']);
            }

            if (!empty($prefs['features']) && is_array($prefs['features'])) {
                foreach ($prefs['features'] as $feat) {
                    $query->whereHas('features', fn($q) => $q->where('name', 'like', '%' . $feat . '%'));
                }
            }

            $properties = $query->orderByDesc('is_featured')->orderByDesc('created_at')->limit(6)->get();

            // Fallback: broaden search if nothing found
            if ($properties->isEmpty() && !empty($prefs['city'])) {
                $properties = \App\Models\Property::with(['city', 'features', 'categories', 'agent', 'slug'])
                    ->whereIn('status', ['selling', 'renting'])
                    ->where('moderation_status', 'approved')
                    ->whereHas('city', fn($q) => $q->where('name', 'like', '%' . $prefs['city'] . '%'))
                    ->orderByDesc('is_featured')
                    ->limit(6)
                    ->get();
            }

            // Step 3: AI commentary
            $propSummary = $properties->map(fn($p) =>
                "- {$p->name} | {$p->type} | " . ($p->price ? number_format($p->price, 0) . ' MAD' : 'Price on request') .
                " | {$p->number_bedroom} beds | {$p->square} m² | " . ($p->city?->name ?? 'N/A')
            )->join("\n");

            $prefSummary = json_encode(array_filter($prefs, fn($v) => $v !== null && $v !== [] && $v !== false), JSON_PRETTY_PRINT);

            $lang = $request->language ?? 'the same language the user was using in the conversation';

            $commentary = '';
            if ($properties->isNotEmpty()) {
                $commentary = $this->chat([
                    ['role' => 'system', 'content' => "You are Mahalo AI, a friendly Moroccan real estate assistant. Respond in {$lang}."],
                    ['role' => 'user',   'content' => "The user was looking for:\n{$prefSummary}\n\nWe found these matching properties:\n{$propSummary}\n\nWrite 2–3 warm, helpful sentences introducing these results. Mention what matched and note any trade-offs if the search was broadened. Keep it concise."],
                ], 200);
            }

            return response()->json([
                'ready'      => true,
                'properties' => $properties->map(fn($p) => [
                    'id'               => $p->id,
                    'name'             => $p->name,
                    'type'             => $p->type,
                    'price'            => $p->price,
                    'square'           => $p->square,
                    'number_bedroom'   => $p->number_bedroom,
                    'number_bathroom'  => $p->number_bathroom,
                    'location'         => $p->location,
                    'city'             => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
                    'image'            => $p->image,
                    'images'           => $p->images,
                    'is_featured'      => $p->is_featured,
                    'slug'             => $p->slug ? ['key' => $p->slug->key] : null,
                    'features'         => $p->features->map(fn($f) => ['id' => $f->id, 'name' => $f->name]),
                    'categories'       => $p->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name]),
                    'agent'            => $p->agent ? ['name' => $p->agent->name] : null,
                ]),
                'preferences' => $prefs,
                'commentary'  => $commentary,
                'count'       => $properties->count(),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function extractIntent(string $message): array
    {
        $msg = mb_strtolower($message);

        // Detect cities
        $cities = \App\Models\City::pluck('name')->toArray();
        $detectedCity = null;
        foreach ($cities as $city) {
            if (str_contains($msg, mb_strtolower($city))) {
                $detectedCity = $city;
                break;
            }
        }

        // Detect type
        $wantsRent = preg_match('/louer|location|locat|rent|locataire|bail/i', $msg);
        $wantsSale = preg_match('/acheter|achat|vente|vendre|acquérir|sale|buy|invest/i', $msg);
        $wantsAgent = preg_match('/agent|conseiller|contact|appeler|joindre|vendeur/i', $msg);

        // Property intent keywords
        $wantsProperties = preg_match('/appartement|villa|terrain|bureau|studio|maison|bien|propriété|logement|immobilier|quartier|prix|budget|chambre|m²|m2|hectare/i', $msg);

        $type = null;
        if ($wantsRent && !$wantsSale) $type = 'renting';
        if ($wantsSale && !$wantsRent) $type = 'selling';

        return [
            'city'       => $detectedCity,
            'type'       => $type,
            'wantsAgent' => (bool) $wantsAgent,
            'wantsProps' => (bool) ($wantsProperties || $detectedCity || $type),
        ];
    }

    private function fetchDbContext(array $intent): array
    {
        $properties = [];
        $agents     = [];
        $stats      = [];

        // Always fetch platform stats for context
        $selling = \App\Models\Property::where('status', 'selling')->where('moderation_status', 'approved')->count();
        $renting = \App\Models\Property::where('status', 'renting')->where('moderation_status', 'approved')->count();
        $cities  = \App\Models\City::pluck('name')->join(', ');
        $stats   = "Platform has {$selling} properties for sale and {$renting} for rent across cities: {$cities}.";

        // Fetch relevant properties
        if ($intent['wantsProps'] || $intent['city'] || $intent['type']) {
            $query = \App\Models\Property::with(['city', 'agent', 'slug', 'features', 'categories'])
                ->whereIn('status', ['selling', 'renting'])
                ->where('moderation_status', 'approved');

            if ($intent['city']) {
                $query->whereHas('city', fn($q) => $q->where('name', 'like', '%' . $intent['city'] . '%'));
            }
            if ($intent['type']) {
                $query->where('status', $intent['type']);
            }

            $results = $query->orderByDesc('is_featured')->orderByDesc('created_at')->limit(4)->get();

            // Fallback: if city filter returned nothing, broaden
            if ($results->isEmpty() && $intent['city']) {
                $results = \App\Models\Property::with(['city', 'agent', 'slug', 'features', 'categories'])
                    ->whereIn('status', ['selling', 'renting'])
                    ->where('moderation_status', 'approved')
                    ->orderByDesc('is_featured')->limit(4)->get();
            }

            $properties = $results->map(fn($p) => [
                'id'             => $p->id,
                'name'           => $p->name,
                'type'           => $p->type,
                'status'         => $p->status,
                'price'          => $p->price,
                'square'         => $p->square,
                'number_bedroom' => $p->number_bedroom,
                'number_bathroom'=> $p->number_bathroom,
                'location'       => $p->location,
                'city'           => $p->city ? ['id' => $p->city->id, 'name' => $p->city->name] : null,
                'image'          => $p->image,
                'images'         => $p->images,
                'is_featured'    => $p->is_featured,
                'slug'           => $p->slug ? ['key' => $p->slug->key] : null,
                'agent'          => $p->agent ? ['name' => $p->agent->name, 'phone' => $p->agent->phone] : null,
                'features'       => $p->features->map(fn($f) => ['id' => $f->id, 'name' => $f->name])->toArray(),
                'categories'     => $p->categories->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->toArray(),
            ])->toArray();
        }

        // Fetch relevant agents
        if ($intent['wantsAgent'] || $intent['city']) {
            $agentQuery = \App\Models\Agent::query();
            if ($intent['city']) {
                $agentQuery->whereHas('city', fn($q) => $q->where('name', 'like', '%' . $intent['city'] . '%'));
            }
            $agentResults = $agentQuery->limit(3)->get();

            if ($agentResults->isEmpty()) {
                $agentResults = \App\Models\Agent::limit(3)->get();
            }

            $agents = $agentResults->map(fn($a) => [
                'id'     => $a->id,
                'name'   => $a->name,
                'email'  => $a->email,
                'phone'  => $a->phone,
                'avatar' => $a->avatar,
                'city'   => $a->city?->name,
            ])->toArray();
        }

        return ['properties' => $properties, 'agents' => $agents, 'stats' => $stats];
    }

    public function generalChat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
        ]);

        $intent = $this->extractIntent($request->message);
        $ctx    = $this->fetchDbContext($intent);

        // Build context snippet for the AI
        $dbContext = "\n\n--- LIVE PLATFORM DATA ---\n" . $ctx['stats'];

        if (!empty($ctx['properties'])) {
            $dbContext .= "\n\nMatching listings from the database:\n";
            foreach ($ctx['properties'] as $p) {
                $price = $p['price'] ? number_format((float)$p['price'], 0, '.', ' ') . ' MAD' : 'Prix sur demande';
                $city  = $p['city']['name'] ?? 'N/A';
                $dbContext .= "• {$p['name']} | {$p['type']} | {$price} | {$p['square']} m² | {$p['number_bedroom']} ch. | {$city}";
                if (!empty($p['agent']['name'])) $dbContext .= " | Agent: {$p['agent']['name']}";
                $dbContext .= "\n";
            }
            $dbContext .= "\nWhen relevant, mention specific listings from above by name and price. Be concrete.";
        }

        if (!empty($ctx['agents'])) {
            $dbContext .= "\n\nAvailable agents:\n";
            foreach ($ctx['agents'] as $a) {
                $dbContext .= "• {$a['name']}" . ($a['city'] ? " ({$a['city']})" : '') . ($a['phone'] ? " — {$a['phone']}" : '') . "\n";
            }
        }

        $system = 'You are Mahalo AI, a smart real estate assistant for Mahalo — Morocco\'s premier property platform. You help buyers, renters, and investors find and understand properties in Morocco. Answer questions about real estate, neighborhoods, buying/renting processes, market trends, and general property advice. Be helpful, concise, and friendly. Always respond in the same language the user writes in (French, English, or Arabic). When you have real listings or agents from the database, reference them specifically. Do not invent prices or listings — only use the data provided.'
            . $dbContext;

        $messages = [['role' => 'system', 'content' => $system]];

        foreach (($request->history ?? []) as $h) {
            if (isset($h['role'], $h['content'])) {
                $messages[] = ['role' => $h['role'], 'content' => $h['content']];
            }
        }

        $messages[] = ['role' => 'user', 'content' => $request->message];

        try {
            $reply = $this->chat($messages, 500);
            return response()->json([
                'reply'      => $reply,
                'properties' => $ctx['properties'],
                'agents'     => $ctx['agents'],
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
