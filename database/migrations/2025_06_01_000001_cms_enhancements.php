<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add CMS fields to cities table
        Schema::table('cities', function (Blueprint $table) {
            if (!Schema::hasColumn('cities', 'country')) {
                $table->string('country', 120)->nullable()->after('name');
            }
            if (!Schema::hasColumn('cities', 'state')) {
                $table->string('state', 120)->nullable()->after('country');
            }
            if (!Schema::hasColumn('cities', 'image_url')) {
                $table->string('image_url', 500)->nullable()->after('image');
            }
            if (!Schema::hasColumn('cities', 'description')) {
                $table->text('description')->nullable()->after('image_url');
            }
        });

        // Add role to users table
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 30)->default('viewer')->after('email');
            });
        }

        // Site settings table (key-value store)
        if (!Schema::hasTable('site_settings')) {
            Schema::create('site_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key', 120)->unique();
                $table->longText('value')->nullable();
                $table->timestamps();
            });
        }

        // Media library table
        if (!Schema::hasTable('media_files')) {
            Schema::create('media_files', function (Blueprint $table) {
                $table->id();
                $table->string('file_name', 255);
                $table->string('original_name', 255)->nullable();
                $table->string('path', 500);
                $table->string('url', 500)->nullable();
                $table->string('mime_type', 100)->nullable();
                $table->unsignedBigInteger('size')->default(0);
                $table->string('collection', 60)->default('media');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn(['country', 'state', 'image_url', 'description']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('media_files');
    }
};
