<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consult_replies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consult_id');
            $table->text('body');
            $table->enum('sender', ['agent', 'user'])->default('agent');
            $table->timestamps();

            $table->foreign('consult_id')->references('id')->on('re_consults')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consult_replies');
    }
};
