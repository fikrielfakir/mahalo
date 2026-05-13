<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 60);
        $query   = MediaFile::orderBy('created_at', 'desc');

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

        $folder = $request->input('folder') ?? $request->input('collection', 'media');
        $file   = $request->file('file');
        $ext    = $file->getClientOriginalExtension();
        $name   = Str::uuid() . '.' . $ext;

        // Store original first
        $tmpPath = $file->storeAs($folder, $name, 'public');

        // Apply watermark if enabled
        $this->applyWatermark($tmpPath, $ext);

        $url = Storage::disk('public')->url($tmpPath);

        $record = MediaFile::create([
            'file_name'     => $name,
            'original_name' => $file->getClientOriginalName(),
            'path'          => $tmpPath,
            'url'           => $url,
            'mime_type'     => $file->getMimeType(),
            'size'          => Storage::disk('public')->size($tmpPath),
            'collection'    => $folder,
        ]);

        return response()->json([
            'data'    => $record,
            'path'    => $tmpPath,
            'url'     => $url,
            'error'   => false,
            'message' => 'File uploaded.',
        ]);
    }

    private function applyWatermark(string $storedPath, string $ext): void
    {
        try {
            // Load settings from DB
            $settings = DB::table('site_settings')
                ->whereIn('key', ['watermark_enabled', 'watermark_logo_url', 'watermark_position', 'watermark_opacity', 'watermark_size'])
                ->pluck('value', 'key');

            if (($settings['watermark_enabled'] ?? '0') !== '1') return;

            $logoUrl = $settings['watermark_logo_url'] ?? '';
            if (!$logoUrl) return;

            // Only support GD-able formats
            $supportedExt = ['jpg', 'jpeg', 'png', 'webp'];
            if (!in_array(strtolower($ext), $supportedExt)) return;

            if (!extension_loaded('gd')) return;

            $position  = $settings['watermark_position'] ?? 'bottom-right';
            $opacity   = (int) ($settings['watermark_opacity'] ?? 60);
            $sizeRatio = (int) ($settings['watermark_size'] ?? 20);

            // Load the main image from storage
            $diskPath = Storage::disk('public')->path($storedPath);
            $main     = $this->imageFromFile($diskPath);
            if (!$main) return;

            $mainW = imagesx($main);
            $mainH = imagesy($main);

            // Load watermark from URL or storage path
            $watermark = $this->loadWatermarkImage($logoUrl);
            if (!$watermark) {
                imagedestroy($main);
                return;
            }

            // Resize watermark to % of main image width
            $wmW    = (int) ($mainW * $sizeRatio / 100);
            $origW  = imagesx($watermark);
            $origH  = imagesy($watermark);
            $wmH    = (int) ($origH * $wmW / max($origW, 1));

            $resized = imagecreatetruecolor($wmW, $wmH);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            $trans = imagecolorallocatealpha($resized, 0, 0, 0, 127);
            imagefilledrectangle($resized, 0, 0, $wmW, $wmH, $trans);
            imagecopyresampled($resized, $watermark, 0, 0, 0, 0, $wmW, $wmH, $origW, $origH);
            imagedestroy($watermark);

            // Calculate position
            $margin = 10;
            [$dstX, $dstY] = match ($position) {
                'top-left'     => [$margin, $margin],
                'top-right'    => [$mainW - $wmW - $margin, $margin],
                'bottom-left'  => [$margin, $mainH - $wmH - $margin],
                'center'       => [(int)(($mainW - $wmW) / 2), (int)(($mainH - $wmH) / 2)],
                default        => [$mainW - $wmW - $margin, $mainH - $wmH - $margin], // bottom-right
            };

            // Blend watermark with opacity
            $this->imageCopyMergeAlpha($main, $resized, $dstX, $dstY, 0, 0, $wmW, $wmH, $opacity);
            imagedestroy($resized);

            // Save back to disk
            $lext = strtolower($ext);
            if ($lext === 'png') {
                imagepng($main, $diskPath);
            } elseif ($lext === 'webp') {
                imagewebp($main, $diskPath);
            } else {
                imagejpeg($main, $diskPath, 92);
            }

            imagedestroy($main);
        } catch (\Throwable $e) {
            // Watermark errors should not break the upload — silently skip
        }
    }

    private function imageFromFile(string $path): \GdImage|false
    {
        $type = exif_imagetype($path);
        return match ($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($path),
            IMAGETYPE_PNG  => imagecreatefrompng($path),
            IMAGETYPE_WEBP => imagecreatefromwebp($path),
            default        => false,
        };
    }

    private function loadWatermarkImage(string $url): \GdImage|false
    {
        try {
            // If it's a relative /storage path, load from disk
            if (str_starts_with($url, '/storage/')) {
                $rel  = Str::after($url, '/storage/');
                $path = Storage::disk('public')->path($rel);
                if (file_exists($path)) {
                    return $this->imageFromFile($path);
                }
            }

            // Try to fetch from URL
            $ctx  = stream_context_create(['http' => ['timeout' => 5]]);
            $data = @file_get_contents($url, false, $ctx);
            if (!$data) return false;

            $img = @imagecreatefromstring($data);
            return $img ?: false;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * imagecopymerge that respects alpha channel.
     */
    private function imageCopyMergeAlpha(
        \GdImage $dst, \GdImage $src,
        int $dstX, int $dstY,
        int $srcX, int $srcY,
        int $srcW, int $srcH,
        int $pct
    ): void {
        if ($pct >= 100) {
            imagecopy($dst, $src, $dstX, $dstY, $srcX, $srcY, $srcW, $srcH);
            return;
        }

        // Create a temp image for the blend
        $tmp = imagecreatetruecolor($srcW, $srcH);
        imagealphablending($tmp, false);
        imagesavealpha($tmp, true);

        // Copy the destination region into temp
        imagecopy($tmp, $dst, 0, 0, $dstX, $dstY, $srcW, $srcH);

        // Merge source onto temp
        imagecopy($tmp, $src, 0, 0, $srcX, $srcY, $srcW, $srcH);

        // Blend temp onto destination using pct
        imagecopymerge($dst, $tmp, $dstX, $dstY, 0, 0, $srcW, $srcH, $pct);
        imagedestroy($tmp);
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
