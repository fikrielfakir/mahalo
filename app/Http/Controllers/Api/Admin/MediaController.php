<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file'   => 'required|file|image|max:10240',
            'folder' => 'nullable|string|in:properties,projects,agents,avatars',
        ]);

        $folder = $request->input('folder', 'properties');
        $file   = $request->file('file');
        $ext    = $file->getClientOriginalExtension();
        $name   = Str::uuid() . '.' . $ext;

        $path = $file->storeAs($folder, $name, 'public');

        return response()->json([
            'path' => $path,
            'url'  => Storage::disk('public')->url($path),
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate(['path' => 'required|string']);
        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return response()->json(['deleted' => true]);
    }
}
