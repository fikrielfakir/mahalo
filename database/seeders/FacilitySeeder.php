<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_facilities')->truncate();

        $facilities = [
            ['id' => 1,  'name' => 'School',            'icon' => 'ti ti-school'],
            ['id' => 2,  'name' => 'Market',            'icon' => 'ti ti-building-store'],
            ['id' => 3,  'name' => 'Medical Center',    'icon' => 'ti ti-medical-cross'],
            ['id' => 4,  'name' => 'Restaurant',        'icon' => 'ti ti-tools-kitchen-2'],
            ['id' => 5,  'name' => 'Gym',               'icon' => 'ti ti-barbell'],
            ['id' => 6,  'name' => 'Pharmacy',          'icon' => 'ti ti-pill'],
            ['id' => 7,  'name' => 'Bank',              'icon' => 'ti ti-building-bank'],
            ['id' => 8,  'name' => 'Bus Stop',          'icon' => 'ti ti-bus'],
            ['id' => 9,  'name' => 'Airport',           'icon' => 'ti ti-plane'],
            ['id' => 10, 'name' => 'Shopping Mall',     'icon' => 'ti ti-building'],
            ['id' => 11, 'name' => 'Public Park',       'icon' => 'ti ti-trees'],
        ];

        foreach ($facilities as $f) {
            DB::table('re_facilities')->insert([
                'id'         => $f['id'],
                'name'       => $f['name'],
                'icon'       => $f['icon'],
                'status'     => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
