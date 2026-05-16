<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64)->index();
            $table->string('ip_address', 45)->nullable()->index();
            $table->string('page', 500)->nullable();
            $table->string('referrer', 500)->nullable();
            $table->string('country', 100)->nullable()->index();
            $table->string('country_code', 10)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('device_type', 20)->nullable()->index(); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable()->index();
            $table->string('os', 50)->nullable()->index();
            $table->string('user_agent', 500)->nullable();
            $table->boolean('is_bot')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
