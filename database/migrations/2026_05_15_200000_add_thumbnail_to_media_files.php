<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media_files', function (Blueprint $table) {
            $table->string('thumbnail_path', 500)->nullable()->after('collection');
            $table->string('thumbnail_url', 500)->nullable()->after('thumbnail_path');
        });
    }

    public function down(): void
    {
        Schema::table('media_files', function (Blueprint $table) {
            $table->dropColumn(['thumbnail_path', 'thumbnail_url']);
        });
    }
};
