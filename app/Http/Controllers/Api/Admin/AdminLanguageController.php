<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminLanguageController extends Controller
{
    public function index(): JsonResponse
    {
        $languages = DB::table('languages')->orderBy('sort_order')->orderBy('id')->get();
        return response()->json(['data' => $languages, 'error' => false, 'message' => null]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code'          => 'required|string|max:10|unique:languages,code',
            'label'         => 'required|string|max:100',
            'native_label'  => 'nullable|string|max:100',
            'flag'          => 'nullable|string|max:20',
            'mymemory_code' => 'nullable|string|max:10',
            'is_rtl'        => 'boolean',
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
        ]);

        $id = DB::table('languages')->insertGetId(array_merge($data, [
            'is_rtl'     => $data['is_rtl']     ?? false,
            'is_active'  => $data['is_active']  ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]));

        $language = DB::table('languages')->find($id);
        return response()->json(['data' => $language, 'error' => false, 'message' => 'Language created'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $language = DB::table('languages')->find($id);
        if (!$language) {
            return response()->json(['error' => true, 'message' => 'Language not found'], 404);
        }

        $data = $request->validate([
            'code'          => "sometimes|string|max:10|unique:languages,code,{$id}",
            'label'         => 'sometimes|string|max:100',
            'native_label'  => 'nullable|string|max:100',
            'flag'          => 'nullable|string|max:20',
            'mymemory_code' => 'nullable|string|max:10',
            'is_rtl'        => 'boolean',
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
        ]);

        DB::table('languages')->where('id', $id)->update(array_merge($data, ['updated_at' => now()]));

        $updated = DB::table('languages')->find($id);
        return response()->json(['data' => $updated, 'error' => false, 'message' => 'Language updated']);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = DB::table('languages')->where('id', $id)->delete();
        if (!$deleted) {
            return response()->json(['error' => true, 'message' => 'Language not found'], 404);
        }
        return response()->json(['data' => null, 'error' => false, 'message' => 'Language deleted']);
    }

    public function publicList(): JsonResponse
    {
        $languages = DB::table('languages')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        return response()->json(['data' => $languages, 'error' => false, 'message' => null]);
    }
}
