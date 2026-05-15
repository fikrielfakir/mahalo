<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('re_properties', function (Blueprint $table) {
            $table->string('condition',   80)->nullable()->after('number_floor');
            $table->string('age_range',   80)->nullable()->after('condition');
            $table->string('orientation', 80)->nullable()->after('age_range');
            $table->string('flooring',    80)->nullable()->after('orientation');
        });
    }

    public function down(): void
    {
        Schema::table('re_properties', function (Blueprint $table) {
            $table->dropColumn(['condition', 'age_range', 'orientation', 'flooring']);
        });
    }
};
