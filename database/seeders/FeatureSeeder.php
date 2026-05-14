<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeatureSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_features')->truncate();

        $features = [
            ['id' => 1,  'name' => 'Air Conditioning',  'icon' => 'ti ti-wind'],
            ['id' => 2,  'name' => 'Swimming Pool',      'icon' => 'ti ti-pool'],
            ['id' => 3,  'name' => 'Gym / Fitness',      'icon' => 'ti ti-barbell'],
            ['id' => 4,  'name' => 'Parking',            'icon' => 'ti ti-parking'],
            ['id' => 5,  'name' => 'Garden',             'icon' => 'ti ti-plant'],
            ['id' => 6,  'name' => 'Security',           'icon' => 'ti ti-shield'],
            ['id' => 7,  'name' => 'Elevator',           'icon' => 'ti ti-elevator'],
            ['id' => 8,  'name' => 'Balcony',            'icon' => 'ti ti-home'],
            ['id' => 9,  'name' => 'Pet Friendly',       'icon' => 'ti ti-dog'],
            ['id' => 10, 'name' => 'Smart Home',         'icon' => 'ti ti-smart-home'],
            ['id' => 11, 'name' => 'Solar Panels',       'icon' => 'ti ti-solar-panel'],
            ['id' => 12, 'name' => 'Fireplace',          'icon' => 'ti ti-flame'],
        ];

        foreach ($features as $f) {
            DB::table('re_features')->insert([
                'id'     => $f['id'],
                'name'   => $f['name'],
                'icon'   => $f['icon'],
                'status' => 'published',
            ]);
        }
    }
}
