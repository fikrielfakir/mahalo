<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings_translations', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 5);
            $table->string('key', 120);
            $table->longText('value')->nullable();
            $table->timestamps();

            $table->unique(['locale', 'key']);
            $table->index('locale');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings_translations');
    }
};
