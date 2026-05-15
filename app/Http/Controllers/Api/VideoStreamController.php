<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream(Request $request, string $path): StreamedResponse|\Illuminate\Http\Response
    {
        $disk = Storage::disk('public');

        if (! $disk->exists($path)) {
            abort(404, 'Video not found');
        }

        $fullPath  = $disk->path($path);
        $mimeType  = $disk->mimeType($path) ?: 'video/mp4';
        $fileSize  = $disk->size($path);

        $start  = 0;
        $end    = $fileSize - 1;
        $length = $fileSize;
        $status = 200;

        $rangeHeader = $request->header('Range');

        if ($rangeHeader) {
            preg_match('/bytes=(\d*)-(\d*)/i', $rangeHeader, $matches);
            $start = max(0, $matches[1] !== '' ? (int) $matches[1] : 0);
            $end   = $matches[2] !== '' ? (int) $matches[2] : $fileSize - 1;
            $end   = min($end, $fileSize - 1);
            if ($start > $end || $start >= $fileSize) {
                return response('Range Not Satisfiable', 416,
                    ['Content-Range' => "bytes */{$fileSize}"]);
            }
            $length = $end - $start + 1;
            $status = 206;
        }

        $headers = [
            'Content-Type'              => $mimeType,
            'Content-Length'            => $length,
            'Accept-Ranges'             => 'bytes',
            'Content-Disposition'       => 'inline',
            'Cache-Control'             => 'public, max-age=86400',
            'X-Content-Type-Options'    => 'nosniff',
        ];

        if ($status === 206) {
            $headers['Content-Range'] = "bytes {$start}-{$end}/{$fileSize}";
        }

        return response()->stream(function () use ($fullPath, $start, $length) {
            $handle = fopen($fullPath, 'rb');
            fseek($handle, $start);
            $remaining = $length;
            $chunkSize = 1024 * 64;

            while (! feof($handle) && $remaining > 0) {
                $chunk = fread($handle, min($chunkSize, $remaining));
                echo $chunk;
                $remaining -= strlen($chunk);
                flush();
            }

            fclose($handle);
        }, $status, $headers);
    }
}
