<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite does not support ALTER COLUMN — use a raw workaround
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            // SQLite already stores the string paths fine; just ensure
            // the column definition is consistent going forward.
            // We rebuild via a temp column swap.
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->string('avatar_id_new', 500)->nullable();
            });
            DB::statement('UPDATE re_accounts SET avatar_id_new = CAST(avatar_id AS TEXT)');
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->dropColumn('avatar_id');
            });
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->renameColumn('avatar_id_new', 'avatar_id');
            });
        } else {
            // MySQL / PostgreSQL — standard column change
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->string('avatar_id', 500)->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->unsignedBigInteger('avatar_id_old')->nullable();
            });
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->dropColumn('avatar_id');
            });
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->renameColumn('avatar_id_old', 'avatar_id');
            });
        } else {
            Schema::table('re_accounts', function (Blueprint $table) {
                $table->unsignedBigInteger('avatar_id')->nullable()->change();
            });
        }
    }
};
