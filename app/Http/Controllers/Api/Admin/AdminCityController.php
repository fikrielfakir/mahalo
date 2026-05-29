<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Traits\AppliesContentTranslations;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCityController extends Controller
{
    use AppliesContentTranslations;
    public function index(Request $request): JsonResponse
    {
        $q = City::withCount('properties');

        if ($s = $request->input('search')) {
            $q->where('name', 'like', "%{$s}%")
              ->orWhere('country', 'like', "%{$s}%");
        }

        $perPage = (int) $request->input('per_page', 15);
        $cities  = $q->orderBy('name')->paginate($perPage);

        return response()->json([
            'data'  => $cities->items(),
            'meta'  => [
                'total'        => $cities->total(),
                'per_page'     => $cities->perPage(),
                'current_page' => $cities->currentPage(),
                'last_page'    => $cities->lastPage(),
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function publicList(Request $request): JsonResponse
    {
        $locale = $this->resolveLocale($request);
        $cities = City::orderBy('name')->get(['id', 'name', 'country', 'state', 'image', 'image_url']);

        $translated = $cities->map(function ($city) use ($locale) {
            $data = $city->toArray();
            return $this->overlayTranslations($data, City::class, $city->id, $locale, ['name', 'country', 'state']);
        });

        return response()->json(['data' => $translated, 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:120',
            'country'     => 'nullable|string|max:120',
            'state'       => 'nullable|string|max:120',
            'image_url'   => 'nullable|string|max:500',
            'description' => 'nullable|string',
        ]);

        $city = City::create(array_merge(['status' => 'published', 'order' => 0], $data));

        return response()->json(['data' => $city, 'error' => false, 'message' => 'City created.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $city = City::findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|string|max:120',
            'country'     => 'nullable|string|max:120',
            'state'       => 'nullable|string|max:120',
            'image_url'   => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'status'      => 'in:published,draft',
        ]);

        $city->update($data);

        return response()->json(['data' => $city, 'error' => false, 'message' => 'City updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        City::findOrFail($id)->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'City deleted.']);
    }
}
