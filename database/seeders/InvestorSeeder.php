<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvestorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_investors')->truncate();

        $investors = [
            'National Pension Service',
            'Generali',
            'Temasek',
            'China Investment Corporation',
            'Government Pension Fund Global',
            'PSP Investments',
            'MEAG Munich ERGO',
            'HOOPP',
            'BT Group',
            'New York City ERS',
            'New Jersey Division of Investment',
            'State Super',
            'Shinkong',
            'Rest Super',
        ];

        foreach ($investors as $i => $name) {
            DB::table('re_investors')->insert([
                'id'         => $i + 1,
                'name'       => $name,
                'status'     => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
