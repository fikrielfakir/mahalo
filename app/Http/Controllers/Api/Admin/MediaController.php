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
        // Try shell_exec first (web server PATH may differ from CLI PATH)
        $bin = trim((string) @shell_exec('which ffmpeg 2>/dev/null'));
        if ($bin && file_exists($bin)) return $bin;

        // Try exec as fallback
        @exec('which ffmpeg 2>/dev/null', $out);
        $bin = trim($out[0] ?? '');
        if ($bin && file_exists($bin)) return $bin;

        // Scan NixOS /nix/store for any ffmpeg binary (handles hash changes after updates)
        $nixMatches = glob('/nix/store/*/bin/ffmpeg');
        if ($nixMatches) {
            foreach ($nixMatches as $path) {
                if (is_executable($path)) return $path;
            }
        }

        // Check common fixed locations
        $candidates = [
            '/nix/store/y7m7h744qpw8hidkkxnhx7wzgv59w287-replit-runtime-path/bin/ffmpeg',
            '/usr/bin/ffmpeg',
            '/usr/local/bin/ffmpeg',
            '/opt/homebrew/bin/ffmpeg',
            '/snap/bin/ffmpeg',
        ];
        foreach ($candidates as $path) {
            if (file_exists($path) && is_executable($path)) return $path;
        }

        \Illuminate\Support\Facades\Log::warning('ffmpeg binary not found', [
            'PATH' => getenv('PATH'),
        ]);
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

        if (!file_exists($videoFullPath) || filesize($videoFullPath) === 0) return null;

        $ffmpegBin = $this->getFfmpegBin();

        // Ensure the thumbs directory exists
        $thumbDir = dirname($thumbDiskPath);
        if (!is_dir($thumbDir)) {
            mkdir($thumbDir, 0755, true);
        }

        $base = escapeshellarg($ffmpegBin) . ' -y';
        $out_arg = ' -frames:v 1 -vf scale=640:-2 -q:v 3 -update 1 ' . escapeshellarg($thumbDiskPath);
        $in_arg  = ' -i ' . escapeshellarg($videoFullPath);

        // Ordered strategies: most compatible first
        $strategies = [
            // 1. No seek — grab the very first decodable frame (most reliable)
            $base . $in_arg . $out_arg,
            // 2. Slow seek (after -i) at 1 s — better quality frame if video is long enough
            $base . $in_arg . ' -ss 1' . $out_arg,
            // 3. Fast seek (before -i) at 0.5 s
            $base . ' -ss 0.5' . $in_arg . $out_arg,
            // 4. Fast seek at 0.1 s
            $base . ' -ss 0.1' . $in_arg . $out_arg,
            // 5. Force mjpeg decoder, no seek
            $base . ' -c:v mjpeg' . $in_arg . $out_arg,
            // 6. thumbnail filter — lets ffmpeg pick the best representative frame
            $base . $in_arg . ' -vf "thumbnail,scale=640:-2" -frames:v 1 -q:v 3 -update 1 ' . escapeshellarg($thumbDiskPath),
            // 7. Skip non-reference frames — helps with HEVC/H.265 and problematic codecs
            $base . ' -skip_frame noref' . $in_arg . ' -frames:v 1 -vf scale=640:-2 -q:v 5 -update 1 ' . escapeshellarg($thumbDiskPath),
        ];

        $errFile = sys_get_temp_dir() . '/ffmpeg_thumb_' . getmypid() . '.log';

        foreach ($strategies as $strategyIndex => $cmd) {
            @unlink($thumbDiskPath);
            exec($cmd . ' 2>' . escapeshellarg($errFile), $cmdOut, $ret);

            if (file_exists($thumbDiskPath) && filesize($thumbDiskPath) > 0) {
                @unlink($errFile);
                return $thumbStorePath;
            }

            $stderr = file_exists($errFile) ? trim(file_get_contents($errFile)) : '';
            \Illuminate\Support\Facades\Log::warning('ffmpeg thumbnail strategy failed', [
                'strategy' => $strategyIndex + 1,
                'cmd'      => $cmd,
                'ret'      => $ret,
                'stderr'   => mb_substr($stderr, -800),
            ]);
        }

        @unlink($errFile);
        return null;
    }

    public function rethumbnail(int $id)
    {
        $record = MediaFile::findOrFail($id);

        if (!str_starts_with($record->mime_type ?? '', 'video/')) {
            return response()->json(['error' => true, 'message' => 'Not a video file.'], 422);
        }

        $videoFullPath = Storage::disk('public')->path($record->path);

        $folder         = dirname($record->path);
        $thumbName      = Str::uuid() . '.jpg';
        $thumbStorePath = $folder . '/thumbs/' . $thumbName;
        $thumbDiskPath  = Storage::disk('public')->path($thumbStorePath);
        @mkdir(dirname($thumbDiskPath), 0755, true);

        $thumbnailPath = null;

        if (file_exists($videoFullPath) && filesize($videoFullPath) > 0) {
            // File is local — extract thumbnail directly
            $thumbnailPath = $this->generateVideoThumbnail($videoFullPath, $thumbDiskPath, $thumbStorePath);
        } else {
            $remoteUrl = $record->url;
            if (!$remoteUrl) {
                return response()->json(['error' => true, 'message' => 'Video file not found on disk and no remote URL is stored.'], 404);
            }

            // Strategy A: Pass URL directly to ffmpeg — no PHP memory download required.
            // ffmpeg streams the video over HTTP and extracts the frame efficiently.
            $thumbnailPath = $this->generateVideoThumbnailFromUrl($remoteUrl, $thumbDiskPath, $thumbStorePath);

            // Strategy B: Fall back to PHP download only if ffmpeg URL input failed
            if (!$thumbnailPath) {
                @mkdir(dirname($videoFullPath), 0755, true);
                $ctx  = stream_context_create(['http' => ['timeout' => 90, 'follow_location' => true]]);
                $data = @file_get_contents($remoteUrl, false, $ctx);
                if ($data && strlen($data) >= 512 && $this->looksLikeVideo($data)) {
                    file_put_contents($videoFullPath, $data);
                    $thumbnailPath = $this->generateVideoThumbnail($videoFullPath, $thumbDiskPath, $thumbStorePath);
                    @unlink($videoFullPath);
                }
            }
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

    public function batchRethumbnail(Request $request)
    {
        $records = MediaFile::whereNull('thumbnail_url')
            ->where(function ($q) {
                $q->where('mime_type', 'like', 'video/%')
                  ->orWhere('file_name', 'like', '%.mp4')
                  ->orWhere('file_name', 'like', '%.mov')
                  ->orWhere('file_name', 'like', '%.webm')
                  ->orWhere('file_name', 'like', '%.avi');
            })
            ->get();

        $done   = 0;
        $failed = [];

        foreach ($records as $record) {
            $videoFullPath = Storage::disk('public')->path($record->path);
            $thumbnailPath = null;

            $folder         = dirname($record->path);
            $thumbName      = Str::uuid() . '.jpg';
            $thumbStorePath = $folder . '/thumbs/' . $thumbName;
            $thumbDiskPath  = Storage::disk('public')->path($thumbStorePath);
            @mkdir(dirname($thumbDiskPath), 0755, true);

            if (file_exists($videoFullPath) && filesize($videoFullPath) > 0) {
                // File is local
                $thumbnailPath = $this->generateVideoThumbnail($videoFullPath, $thumbDiskPath, $thumbStorePath);
            } else {
                $remoteUrl = $record->url;
                if (!$remoteUrl) { $failed[] = $record->id; continue; }

                // Strategy A: ffmpeg reads directly from URL (no PHP download)
                $thumbnailPath = $this->generateVideoThumbnailFromUrl($remoteUrl, $thumbDiskPath, $thumbStorePath);

                // Strategy B: PHP download fallback
                if (!$thumbnailPath) {
                    @mkdir(dirname($videoFullPath), 0755, true);
                    $ctx  = stream_context_create(['http' => ['timeout' => 90, 'follow_location' => true]]);
                    $data = @file_get_contents($remoteUrl, false, $ctx);
                    if ($data && strlen($data) >= 512 && $this->looksLikeVideo($data)) {
                        file_put_contents($videoFullPath, $data);
                        $thumbnailPath = $this->generateVideoThumbnail($videoFullPath, $thumbDiskPath, $thumbStorePath);
                        @unlink($videoFullPath);
                    }
                }
            }

            if ($thumbnailPath) {
                $record->update([
                    'thumbnail_path' => $thumbnailPath,
                    'thumbnail_url'  => Storage::disk('public')->url($thumbnailPath),
                ]);
                $done++;
            } else {
                $failed[] = $record->id;
            }
        }

        return response()->json([
            'error'   => false,
            'message' => "Generated {$done} thumbnail(s)." . (count($failed) ? ' Failed IDs: ' . implode(', ', $failed) : ''),
            'done'    => $done,
            'failed'  => $failed,
            'total'   => $records->count(),
        ]);
    }

    /**
     * Generate a video thumbnail by pointing ffmpeg at an HTTP/HTTPS URL directly.
     * ffmpeg streams the video; no PHP memory download required.
     */
    private function generateVideoThumbnailFromUrl(string $videoUrl, string $thumbDiskPath, string $thumbStorePath): ?string
    {
        if (!function_exists('exec')) return null;
        $disabled = array_map('trim', explode(',', ini_get('disable_functions')));
        if (in_array('exec', $disabled)) return null;

        $ffmpegBin = $this->getFfmpegBin();

        $thumbDir = dirname($thumbDiskPath);
        if (!is_dir($thumbDir)) {
            mkdir($thumbDir, 0755, true);
        }

        $base    = escapeshellarg($ffmpegBin) . ' -y';
        $in_arg  = ' -i ' . escapeshellarg($videoUrl);
        $out_arg = ' -frames:v 1 -vf scale=640:-2 -q:v 3 -update 1 ' . escapeshellarg($thumbDiskPath);

        $strategies = [
            $base . $in_arg . $out_arg,
            $base . $in_arg . ' -ss 1' . $out_arg,
            $base . ' -ss 0.5' . $in_arg . $out_arg,
            $base . $in_arg . ' -vf "thumbnail,scale=640:-2" -frames:v 1 -q:v 3 -update 1 ' . escapeshellarg($thumbDiskPath),
        ];

        $errFile = sys_get_temp_dir() . '/ffmpeg_url_' . getmypid() . '.log';

        foreach ($strategies as $idx => $cmd) {
            @unlink($thumbDiskPath);
            exec($cmd . ' 2>' . escapeshellarg($errFile), $out, $ret);

            if (file_exists($thumbDiskPath) && filesize($thumbDiskPath) > 0) {
                @unlink($errFile);
                return $thumbStorePath;
            }

            $stderr = file_exists($errFile) ? trim(file_get_contents($errFile)) : '';
            \Illuminate\Support\Facades\Log::warning('ffmpeg URL strategy failed', [
                'strategy' => $idx + 1,
                'url'      => $videoUrl,
                'ret'      => $ret,
                'stderr'   => mb_substr($stderr, -400),
            ]);
        }

        @unlink($errFile);
        return null;
    }

    /**
     * Check if binary data looks like a real video file by inspecting magic bytes.
     * Prevents treating HTML 404 pages or redirects as video content.
     */
    private function looksLikeVideo(string $data): bool
    {
        // HTML responses are not videos
        $start = ltrim(substr($data, 0, 100));
        if (stripos($start, '<!DOCTYPE') === 0 || stripos($start, '<html') === 0) {
            return false;
        }

        $magic = substr($data, 0, 12);

        // MP4 / MOV / M4V: ftyp box at offset 4
        if (substr($data, 4, 4) === 'ftyp') return true;

        // MOV: wide/mdat/free atom signatures
        if (in_array(substr($data, 4, 4), ['mdat', 'wide', 'free', 'moov', 'pnot'])) return true;

        // AVI: RIFF....AVI
        if (substr($magic, 0, 4) === 'RIFF' && substr($data, 8, 4) === 'AVI ') return true;

        // WebM / MKV: EBML magic
        if (substr($magic, 0, 4) === "\x1A\x45\xDF\xA3") return true;

        // MPEG-TS: sync byte 0x47
        if ($magic[0] === "\x47") return true;

        // FLV
        if (substr($magic, 0, 3) === 'FLV') return true;

        // Ogg (OGG video)
        if (substr($magic, 0, 4) === 'OggS') return true;

        return false;
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
