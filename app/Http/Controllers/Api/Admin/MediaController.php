<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 60);

        $query = MediaFile::orderBy('created_at', 'desc');

        if ($collection = $request->input('collection')) {
            $query->where('collection', $collection);
        }

        $files = $query->paginate($perPage);

        return response()->json([
            'data'  => $files->items(),
            'meta'  => [
                'total'        => $files->total(),
                'per_page'     => $files->perPage(),
                'current_page' => $files->currentPage(),
                'last_page'    => $files->lastPage(),
            ],
            'error'   => false,
            'message' => null,
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file'       => 'required|file|image|max:20480',
            'folder'     => 'nullable|string|in:properties,projects,agents,avatars,media',
            'collection' => 'nullable|string|in:properties,projects,agents,avatars,media',
        ]);

        $folder = $request->input('folder')
            ?? $request->input('collection', 'media');

        $file = $request->file('file');
        $ext  = $file->getClientOriginalExtension();
        $name = Str::uuid() . '.' . $ext;
        $path = $file->storeAs($folder, $name, 'public');
        $url  = Storage::disk('public')->url($path);

        $record = MediaFile::create([
            'file_name'     => $name,
            'original_name' => $file->getClientOriginalName(),
            'path'          => $path,
            'url'           => $url,
            'mime_type'     => $file->getMimeType(),
            'size'          => $file->getSize(),
            'collection'    => $folder,
        ]);

        return response()->json([
            'data' => $record,
            'path' => $path,
            'url'  => $url,
            'error'   => false,
            'message' => 'File uploaded.',
        ]);
    }

    public function destroy(int $id)
    {
        $record = MediaFile::findOrFail($id);

        if (Storage::disk('public')->exists($record->path)) {
            Storage::disk('public')->delete($record->path);
        }

        $record->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => 'File deleted.']);
    }

    // Legacy path-based delete (kept for backward compat)
    public function deleteByPath(Request $request)
    {
        $request->validate(['path' => 'required|string']);
        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        MediaFile::where('path', $path)->delete();

        return response()->json(['deleted' => true]);
    }
}
