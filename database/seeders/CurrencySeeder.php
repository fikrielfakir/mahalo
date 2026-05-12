<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_currencies')->truncate();

        DB::table('re_currencies')->insert([
            ['id' => 1, 'title' => 'MAD', 'symbol' => 'MAD', 'is_prefix_symbol' => false, 'decimals' => '0', 'is_default' => true,  'order' => '0', 'exchange_rate' => '1',     'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'title' => 'USD', 'symbol' => '$',   'is_prefix_symbol' => true,  'decimals' => '2', 'is_default' => false, 'order' => '1', 'exchange_rate' => '0.1',   'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'title' => 'EUR', 'symbol' => '€',   'is_prefix_symbol' => false, 'decimals' => '2', 'is_default' => false, 'order' => '2', 'exchange_rate' => '0.092', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
