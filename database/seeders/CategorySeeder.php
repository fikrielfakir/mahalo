<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_categories')->truncate();
        DB::table('slugs')->where('reference_type', 'Botble\\RealEstate\\Models\\Category')->delete();

        $categories = [
            ['id' => 1, 'name' => 'Apartment',         'slug' => 'apartment',          'order' => 1],
            ['id' => 2, 'name' => 'Villa',              'slug' => 'villa',              'order' => 2],
            ['id' => 3, 'name' => 'Condo',              'slug' => 'condo',              'order' => 3],
            ['id' => 4, 'name' => 'House',              'slug' => 'house',              'order' => 4],
            ['id' => 5, 'name' => 'Land',               'slug' => 'land',               'order' => 5],
            ['id' => 6, 'name' => 'Commercial Property','slug' => 'commercial-property','order' => 6],
        ];

        foreach ($categories as $cat) {
            DB::table('re_categories')->insert([
                'id'         => $cat['id'],
                'name'       => $cat['name'],
                'status'     => 'published',
                'order'      => $cat['order'],
                'is_default' => 0,
                'parent_id'  => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('slugs')->insert([
                'key'            => $cat['slug'],
                'reference_id'   => $cat['id'],
                'reference_type' => 'Botble\\RealEstate\\Models\\Category',
                'prefix'         => 'property-category',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }
    }
}
