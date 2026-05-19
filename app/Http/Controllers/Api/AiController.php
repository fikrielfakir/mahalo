<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    private string $groqBase = 'https://api.groq.com/openai/v1';
    private string $model    = 'llama-3.3-70b-versatile';

    private function chat(array $messages, int $maxTokens = 800): string
    {
        $key = env('GROQ_API_KEY');
        if (!$key) {
            throw new \RuntimeException('GROQ_API_KEY is not configured.');
        }

        $response = Http::withToken($key)
            ->timeout(30)
            ->post("{$this->groqBase}/chat/completions", [
                'model'       => $this->model,
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

    public function generalChat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
        ]);

        $system = 'You are Mahalo AI, a smart real estate assistant for Mahalo — Morocco\'s premier property platform. You help buyers, renters, and investors find and understand properties in Morocco. Answer questions about real estate in Morocco, neighborhoods, buying/renting processes, market trends, and general property advice. Be helpful, concise, and friendly. Always respond in the same language the user writes in. If you cannot answer something, suggest the user contact a Mahalo agent.';

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
}
