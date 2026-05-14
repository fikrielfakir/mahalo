<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('professional_status')->nullable()->after('license_number');
            $table->text('professional_bio')->nullable()->after('professional_status');
            $table->string('professional_specialty')->nullable()->after('professional_bio');
            $table->unsignedTinyInteger('professional_experience_years')->nullable()->after('professional_specialty');
            $table->string('professional_phone')->nullable()->after('professional_experience_years');
            $table->unsignedBigInteger('professional_city_id')->nullable()->after('professional_phone');
            $table->timestamp('professional_applied_at')->nullable()->after('professional_city_id');
            $table->string('professional_reject_reason')->nullable()->after('professional_applied_at');
            $table->unsignedBigInteger('professional_agent_id')->nullable()->after('professional_reject_reason');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'professional_status', 'professional_bio', 'professional_specialty',
                'professional_experience_years', 'professional_phone', 'professional_city_id',
                'professional_applied_at', 'professional_reject_reason', 'professional_agent_id',
            ]);
        });
    }
};
