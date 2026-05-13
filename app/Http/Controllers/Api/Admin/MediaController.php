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
            'file'       => 'required|file|max:102400|mimes:jpg,jpeg,png,webp,gif,svg,mp4,mov,avi,mkv,webm,m4v',
            'folder'     => 'nullable|string|in:properties,projects,agents,avatars,media,videos',
            'collection' => 'nullable|string|in:properties,projects,agents,avatars,media,videos',
        ]);

        $file   = $request->file('file');
        $mime   = $file->getMimeType();
        $isVideo = str_starts_with($mime, 'video/');

        $folder = $request->input('folder') ?? $request->input('collection', $isVideo ? 'videos' : 'media');
        $ext    = $file->getClientOriginalExtension();
        $name   = Str::uuid() . '.' . $ext;

        $tmpPath = $file->storeAs($folder, $name, 'public');

        // Only watermark images, not videos
        if (!$isVideo) {
            $this->applyWatermark($tmpPath, $ext);
        }

        $url = Storage::disk('public')->url($tmpPath);

        $record = MediaFile::create([
            'file_name'     => $name,
            'original_name' => $file->getClientOriginalName(),
            'path'          => $tmpPath,
            'url'           => $url,
            'mime_type'     => $mime,
            'size'          => Storage::disk('public')->size($tmpPath),
            'collection'    => $folder,
        ]);

        return response()->json([
            'data'    => $record,
            'path'    => $tmpPath,
            'url'     => $url,
            'is_video'=> $isVideo,
            'error'   => false,
            'message' => 'File uploaded.',
        ]);
    }

    private function applyWatermark(string $storedPath, string $ext): void
    {
        try {
            $supportedExt = ['jpg', 'jpeg', 'png', 'webp'];
            if (!in_array(strtolower($ext), $supportedExt)) return;

            if (!extension_loaded('gd')) return;

            // Load settings from DB, fall back to sensible defaults
            $settings = DB::table('site_settings')
                ->whereIn('key', ['watermark_enabled', 'watermark_logo_url', 'watermark_position', 'watermark_opacity', 'watermark_size'])
                ->pluck('value', 'key');

            if (($settings['watermark_enabled'] ?? '1') === '0') return;

            $position  = $settings['watermark_position'] ?? 'center';
            $opacity   = (int) ($settings['watermark_opacity'] ?? 60);
            $sizeRatio = (int) ($settings['watermark_size'] ?? 20);

            // Resolve watermark image: custom logo from settings, or bundled default
            $logoUrl = $settings['watermark_logo_url'] ?? '';
            $watermarkFile = public_path('watermark.png');

            $diskPath = Storage::disk('public')->path($storedPath);
            $main     = $this->imageFromFile($diskPath);
            if (!$main) return;

            $mainW = imagesx($main);
            $mainH = imagesy($main);

            // Try custom logo URL first, then fall back to the bundled PNG
            $watermark = null;
            if ($logoUrl) {
                $watermark = $this->loadWatermarkImage($logoUrl) ?: null;
            }
            if (!$watermark && file_exists($watermarkFile)) {
                $watermark = @imagecreatefrompng($watermarkFile) ?: null;
            }
            if (!$watermark) { imagedestroy($main); return; }

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

            $margin = 10;
            [$dstX, $dstY] = match ($position) {
                'top-left'    => [$margin, $margin],
                'top-right'   => [$mainW - $wmW - $margin, $margin],
                'bottom-left' => [$margin, $mainH - $wmH - $margin],
                'center'      => [(int)(($mainW - $wmW) / 2), (int)(($mainH - $wmH) / 2)],
                default       => [$mainW - $wmW - $margin, $mainH - $wmH - $margin],
            };

            $this->imageCopyMergeAlpha($main, $resized, $dstX, $dstY, 0, 0, $wmW, $wmH, $opacity);
            imagedestroy($resized);

            $lext = strtolower($ext);
            if ($lext === 'png')       imagepng($main, $diskPath);
            elseif ($lext === 'webp')  imagewebp($main, $diskPath);
            else                       imagejpeg($main, $diskPath, 92);

            imagedestroy($main);
        } catch (\Throwable $e) {}
    }

    private function imageFromFile(string $path): \GdImage|false
    {
        $type = @exif_imagetype($path);
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
            if (str_starts_with($url, '/storage/')) {
                $rel  = Str::after($url, '/storage/');
                $path = Storage::disk('public')->path($rel);
                if (file_exists($path)) return $this->imageFromFile($path);
            }
            // Handle root-relative paths like /watermark.png
            if (str_starts_with($url, '/') && !str_starts_with($url, '//')) {
                $path = public_path(ltrim($url, '/'));
                if (file_exists($path)) return $this->imageFromFile($path);
                return false;
            }
            $ctx  = stream_context_create(['http' => ['timeout' => 5]]);
            $data = @file_get_contents($url, false, $ctx);
            if (!$data) return false;
            $img = @imagecreatefromstring($data);
            return $img ?: false;
        } catch (\Throwable) {
            return false;
        }
    }

    private function imageCopyMergeAlpha(
        \GdImage $dst, \GdImage $src,
        int $dstX, int $dstY, int $srcX, int $srcY,
        int $srcW, int $srcH, int $pct
    ): void {
        // Enable alpha blending on destination so semi-transparent pixels composite correctly
        imagealphablending($dst, true);

        for ($x = 0; $x < $srcW; $x++) {
            for ($y = 0; $y < $srcH; $y++) {
                $pixel = imagecolorat($src, $srcX + $x, $srcY + $y);
                $srcAlpha = ($pixel >> 24) & 0x7F; // 0 = fully opaque, 127 = fully transparent

                // Skip fully transparent pixels — leave background untouched
                if ($srcAlpha === 127) continue;

                $r = ($pixel >> 16) & 0xFF;
                $g = ($pixel >> 8)  & 0xFF;
                $b = $pixel         & 0xFF;

                // Combine watermark pixel's own transparency with the global opacity setting.
                // $pct=100 → fully opaque (no extra alpha), $pct=0 → fully transparent.
                $opacityAlpha  = (int) round(127 * (1 - $pct / 100));
                $combinedAlpha = min(127, $srcAlpha + $opacityAlpha);

                $color = imagecolorallocatealpha($dst, $r, $g, $b, $combinedAlpha);
                imagesetpixel($dst, $dstX + $x, $dstY + $y, $color);
            }
        }
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
