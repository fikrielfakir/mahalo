<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use ZipArchive;

class AdminAppUpdateController extends Controller
{
    private string $updateLogTable = 'app_updates';

    private function ensureTable(): void
    {
        if (!DB::getSchemaBuilder()->hasTable($this->updateLogTable)) {
            DB::statement("
                CREATE TABLE IF NOT EXISTS {$this->updateLogTable} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    size INTEGER NOT NULL,
                    files_extracted INTEGER NOT NULL DEFAULT 0,
                    status TEXT NOT NULL DEFAULT 'success',
                    note TEXT,
                    applied_by TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ");
        }
    }

    public function history(): JsonResponse
    {
        $this->ensureTable();

        $rows = DB::table($this->updateLogTable)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return response()->json(['data' => $rows, 'error' => false]);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'zip' => 'required|file|mimes:zip|max:524288',
        ]);

        $this->ensureTable();

        $file     = $request->file('zip');
        $origName = $file->getClientOriginalName();
        $size     = $file->getSize();

        $tmpPath = $file->getRealPath();

        $zip = new ZipArchive();
        if ($zip->open($tmpPath) !== true) {
            return response()->json([
                'error'   => true,
                'message' => 'Failed to open ZIP file. Ensure it is a valid ZIP archive.',
            ], 422);
        }

        $targetDir = public_path('app');

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $extractedCount = 0;
        $skipped        = 0;

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);

            if ($this->isDangerous($entry)) {
                $skipped++;
                continue;
            }

            $destPath = $targetDir . DIRECTORY_SEPARATOR . $entry;
            $destDir  = dirname($destPath);

            if (!is_dir($destDir)) {
                mkdir($destDir, 0755, true);
            }

            if (str_ends_with($entry, '/')) {
                continue;
            }

            $contents = $zip->getFromIndex($i);
            if ($contents !== false) {
                file_put_contents($destPath, $contents);
                $extractedCount++;
            }
        }

        $zip->close();

        $note = $skipped > 0
            ? "{$skipped} dangerous file(s) skipped for security."
            : null;

        DB::table($this->updateLogTable)->insert([
            'filename'        => $origName,
            'size'            => $size,
            'files_extracted' => $extractedCount,
            'status'          => 'success',
            'note'            => $note,
            'applied_by'      => $request->user()?->email ?? 'admin',
            'created_at'      => now(),
        ]);

        return response()->json([
            'error'   => false,
            'message' => "Update applied successfully. {$extractedCount} file(s) extracted." . ($note ? " Note: {$note}" : ''),
            'data'    => [
                'filename'        => $origName,
                'files_extracted' => $extractedCount,
                'skipped'         => $skipped,
            ],
        ]);
    }

    public function deleteHistory(int $id): JsonResponse
    {
        $this->ensureTable();
        DB::table($this->updateLogTable)->where('id', $id)->delete();
        return response()->json(['error' => false, 'message' => 'Record deleted.']);
    }

    private function isDangerous(string $entry): bool
    {
        $lower = strtolower($entry);

        $blocked = [
            '.php', '.phtml', '.php3', '.php4', '.php5', '.phar',
            '.env', '.htaccess', '.htpasswd', '.sh', '.bash', '.py',
            '.rb', '.pl', '.cgi', '.exe', '.dll', '.so',
        ];

        foreach ($blocked as $ext) {
            if (str_ends_with($lower, $ext)) {
                return true;
            }
        }

        if (str_contains($entry, '../') || str_contains($entry, '..\\')) {
            return true;
        }

        return false;
    }
}
