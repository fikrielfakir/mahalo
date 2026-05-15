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

        $thumbnailPath = null;

        if ($isVideo) {
            // ── Step 1: Extract thumbnail frame ───────────────────────────────
            $thumbName      = Str::uuid() . '.jpg';
            $thumbStorePath = $folder . '/thumbs/' . $thumbName;
            $thumbDiskPath  = Storage::disk('public')->path($thumbStorePath);
            @mkdir(dirname($thumbDiskPath), 0755, true);
            $videoFullPath  = Storage::disk('public')->path($tmpPath);

            $thumbnailPath = $this->generateVideoThumbnail($videoFullPath, $thumbDiskPath, $thumbStorePath);

            // ── Step 2: Apply watermark to thumbnail frame ────────────────────
            if ($thumbnailPath) {
                $this->applyWatermark($thumbStorePath, 'jpg');
            }

            // ── Step 3: Burn watermark into full video ────────────────────────
            $wmSettings = DB::table('site_settings')
                ->whereIn('key', ['watermark_enabled', 'watermark_logo_url', 'watermark_position', 'watermark_opacity', 'watermark_size'])
                ->pluck('value', 'key');

            if (($wmSettings['watermark_enabled'] ?? '1') !== '0') {
                $logoPath = $this->resolveWatermarkPath($wmSettings['watermark_logo_url'] ?? '');
                if ($logoPath) {
                    $wmVideoName = Str::uuid() . '.' . $ext;
                    $wmStorePath = $folder . '/' . $wmVideoName;
                    $wmDiskPath  = Storage::disk('public')->path($wmStorePath);
                    $opacity     = round((int)($wmSettings['watermark_opacity'] ?? 60) / 100, 2);
                    $sizeRatio   = (int)($wmSettings['watermark_size'] ?? 20);
                    $position    = $wmSettings['watermark_position'] ?? 'bottom-right';
                    $margin      = 10;
                    $overlayExpr = match($position) {
                        'top-left'    => "overlay={$margin}:{$margin}",
                        'top-right'   => "overlay=W-w-{$margin}:{$margin}",
                        'bottom-left' => "overlay={$margin}:H-h-{$margin}",
                        'center'      => "overlay=(W-w)/2:(H-h)/2",
                        default       => "overlay=W-w-{$margin}:H-h-{$margin}",
                    };
                    $filter = "[1:v]scale=iw*{$sizeRatio}/100:-1,format=rgba,colorchannelmixer=aa={$opacity}[wm];[0:v][wm]{$overlayExpr}[out]";
                    $ffmpegBin = $this->getFfmpegBin();
                    exec(
                        escapeshellarg($ffmpegBin) .
                        " -i " . escapeshellarg($videoFullPath) .
                        " -i " . escapeshellarg($logoPath) .
                        " -filter_complex " . escapeshellarg($filter) .
                        " -map [out] -map 0:a? -c:v libx264 -preset fast -crf 23 -c:a copy " .
                        escapeshellarg($wmDiskPath) . " -y 2>/dev/null",
                        $out2, $code2
                    );
                    if ($code2 === 0 && file_exists($wmDiskPath) && filesize($wmDiskPath) > 0) {
                        Storage::disk('public')->delete($tmpPath);
                        $tmpPath = $wmStorePath;
                    }
                }
            }
        } else {
            $this->applyWatermark($tmpPath, $ext);
        }

        $url = Storage::disk('public')->url($tmpPath);

        $record = MediaFile::create([
            'file_name'      => $name,
            'original_name'  => $file->getClientOriginalName(),
            'path'           => $tmpPath,
            'url'            => $url,
            'mime_type'      => $mime,
            'size'           => Storage::disk('public')->size($tmpPath),
            'collection'     => $folder,
            'thumbnail_path' => $thumbnailPath,
            'thumbnail_url'  => $thumbnailPath ? Storage::disk('public')->url($thumbnailPath) : null,
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

    private function getFfmpegBin(): string
    {
        // Try shell_exec first
        $bin = trim((string) @shell_exec('which ffmpeg 2>/dev/null'));
        if ($bin && file_exists($bin)) return $bin;

        // Try exec as fallback (web server PATH may differ from CLI)
        @exec('which ffmpeg 2>/dev/null', $out, $ret);
        $bin = trim($out[0] ?? '');
        if ($bin && file_exists($bin)) return $bin;

        // Check common NixOS / Replit runtime locations
        $candidates = [
            '/nix/store/y7m7h744qpw8hidkkxnhx7wzgv59w287-replit-runtime-path/bin/ffmpeg',
            '/usr/bin/ffmpeg',
            '/usr/local/bin/ffmpeg',
            '/opt/homebrew/bin/ffmpeg',
        ];
        foreach ($candidates as $path) {
            if (file_exists($path)) return $path;
        }

        return 'ffmpeg';
    }

    private function resolveWatermarkPath(string $logoUrl): ?string
    {
        if ($logoUrl) {
            if (str_starts_with($logoUrl, '/storage/')) {
                $rel  = Str::after($logoUrl, '/storage/');
                $path = Storage::disk('public')->path($rel);
                if (file_exists($path)) return $path;
            } elseif (str_starts_with($logoUrl, '/') && !str_starts_with($logoUrl, '//')) {
                $path = public_path(ltrim($logoUrl, '/'));
                if (file_exists($path)) return $path;
            }
        }
        $default = public_path('watermark.png');
        return file_exists($default) ? $default : null;
    }

    private function generateVideoThumbnail(string $videoFullPath, string $thumbDiskPath, string $thumbStorePath): ?string
    {
        if (!function_exists('exec')) return null;
        $disabled = array_map('trim', explode(',', ini_get('disable_functions')));
        if (in_array('exec', $disabled)) return null;

        $ffmpegBin = $this->getFfmpegBin();

        // Ensure the thumbs directory exists with correct permissions
        $thumbDir = dirname($thumbDiskPath);
        if (!is_dir($thumbDir)) {
            mkdir($thumbDir, 0755, true);
        }

        foreach ([1, 0.5, 0.1, 0] as $seek) {
            @unlink($thumbDiskPath);
            $errFile = sys_get_temp_dir() . '/ffmpeg_thumb_' . getmypid() . '.log';
            $cmd =
                escapeshellarg($ffmpegBin) .
                " -ss {$seek} -i " . escapeshellarg($videoFullPath) .
                " -frames:v 1 -vf scale=640:-1 -q:v 3 -update 1 " .
                escapeshellarg($thumbDiskPath) . " -y 2>" . escapeshellarg($errFile);
            exec($cmd, $out, $ret);
            if (file_exists($thumbDiskPath) && filesize($thumbDiskPath) > 0) {
                @unlink($errFile);
                return $thumbStorePath;
            }
            // Log ffmpeg error for debugging
            if (file_exists($errFile)) {
                \Illuminate\Support\Facades\Log::warning('ffmpeg thumbnail failed', [
                    'seek'    => $seek,
                    'ret'     => $ret,
                    'ffmpeg'  => $ffmpegBin,
                    'video'   => $videoFullPath,
                    'stderr'  => file_get_contents($errFile),
                ]);
                @unlink($errFile);
            }
        }
        return null;
    }

    public function rethumbnail(int $id)
    {
        $record = MediaFile::findOrFail($id);

        if (!str_starts_with($record->mime_type ?? '', 'video/')) {
            return response()->json(['error' => true, 'message' => 'Not a video file.'], 422);
        }

        $videoFullPath = Storage::disk('public')->path($record->path);
        $tempDownloaded = false;

        if (!file_exists($videoFullPath) || filesize($videoFullPath) === 0) {
            $remoteUrl = $record->url;
            if (!$remoteUrl) {
                return response()->json(['error' => true, 'message' => 'Video file not found on disk and no remote URL available.'], 404);
            }
            @mkdir(dirname($videoFullPath), 0755, true);
            $ctx = stream_context_create(['http' => ['timeout' => 60, 'follow_location' => true]]);
            $data = @file_get_contents($remoteUrl, false, $ctx);
            if (!$data) {
                return response()->json(['error' => true, 'message' => 'Video file not on disk and could not be downloaded from: ' . $remoteUrl], 404);
            }
            file_put_contents($videoFullPath, $data);
            $tempDownloaded = true;
        }

        $folder         = dirname($record->path);
        $thumbName      = Str::uuid() . '.jpg';
        $thumbStorePath = $folder . '/thumbs/' . $thumbName;
        $thumbDiskPath  = Storage::disk('public')->path($thumbStorePath);
        @mkdir(dirname($thumbDiskPath), 0755, true);

        $thumbnailPath = $this->generateVideoThumbnail($videoFullPath, $thumbDiskPath, $thumbStorePath);

        if ($tempDownloaded) {
            @unlink($videoFullPath);
        }

        if (!$thumbnailPath) {
            return response()->json(['error' => true, 'message' => 'FFmpeg could not extract a frame from this video.'], 500);
        }

        $record->update([
            'thumbnail_path' => $thumbnailPath,
            'thumbnail_url'  => Storage::disk('public')->url($thumbnailPath),
        ]);

        return response()->json([
            'error'         => false,
            'message'       => 'Thumbnail generated.',
            'thumbnail_url' => $record->fresh()->thumbnail_url,
            'data'          => $record->fresh(),
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
