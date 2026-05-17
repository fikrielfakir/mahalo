<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('label', 100);
            $table->string('native_label', 100)->nullable();
            $table->string('flag', 20)->nullable();
            $table->string('mymemory_code', 10)->nullable();
            $table->boolean('is_rtl')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        DB::table('languages')->insert([
            ['code'=>'fr','label'=>'French',     'native_label'=>'Français',   'flag'=>'🇫🇷','mymemory_code'=>'fr','is_rtl'=>0,'is_active'=>1,'sort_order'=>1,'created_at'=>now(),'updated_at'=>now()],
            ['code'=>'en','label'=>'English',    'native_label'=>'English',    'flag'=>'🇬🇧','mymemory_code'=>'en','is_rtl'=>0,'is_active'=>1,'sort_order'=>2,'created_at'=>now(),'updated_at'=>now()],
            ['code'=>'ar','label'=>'Arabic',     'native_label'=>'العربية',   'flag'=>'🇸🇦','mymemory_code'=>'ar','is_rtl'=>1,'is_active'=>1,'sort_order'=>3,'created_at'=>now(),'updated_at'=>now()],
            ['code'=>'es','label'=>'Spanish',    'native_label'=>'Español',    'flag'=>'🇪🇸','mymemory_code'=>'es','is_rtl'=>0,'is_active'=>1,'sort_order'=>4,'created_at'=>now(),'updated_at'=>now()],
            ['code'=>'tr','label'=>'Turkish',    'native_label'=>'Türkçe',     'flag'=>'🇹🇷','mymemory_code'=>'tr','is_rtl'=>0,'is_active'=>0,'sort_order'=>5,'created_at'=>now(),'updated_at'=>now()],
            ['code'=>'id','label'=>'Indonesian', 'native_label'=>'Bahasa Indonesia','flag'=>'🇮🇩','mymemory_code'=>'id','is_rtl'=>0,'is_active'=>0,'sort_order'=>6,'created_at'=>now(),'updated_at'=>now()],
            ['code'=>'vi','label'=>'Vietnamese', 'native_label'=>'Tiếng Việt', 'flag'=>'🇻🇳','mymemory_code'=>'vi','is_rtl'=>0,'is_active'=>0,'sort_order'=>7,'created_at'=>now(),'updated_at'=>now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
