<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Country
        DB::table('countries')->insert(['id' => 1, 'name' => 'Morocco', 'code' => 'MA', 'status' => 'published', 'created_at' => now(), 'updated_at' => now()]);

        // Cities
        $cities = [
            ['name' => 'Casablanca', 'slug' => 'casablanca', 'country_id' => 1, 'status' => 'published'],
            ['name' => 'Marrakech',  'slug' => 'marrakech',  'country_id' => 1, 'status' => 'published'],
            ['name' => 'Rabat',      'slug' => 'rabat',      'country_id' => 1, 'status' => 'published'],
            ['name' => 'Tanger',     'slug' => 'tanger',     'country_id' => 1, 'status' => 'published'],
            ['name' => 'Agadir',     'slug' => 'agadir',     'country_id' => 1, 'status' => 'published'],
            ['name' => 'Fès',        'slug' => 'fes',        'country_id' => 1, 'status' => 'published'],
        ];
        foreach ($cities as $city) {
            DB::table('cities')->insert(array_merge($city, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Categories
        $categories = [
            ['name' => 'Apartment', 'status' => 'published', 'order' => 1],
            ['name' => 'Villa',     'status' => 'published', 'order' => 2],
            ['name' => 'House',     'status' => 'published', 'order' => 3],
            ['name' => 'Office',    'status' => 'published', 'order' => 4],
            ['name' => 'Land',      'status' => 'published', 'order' => 5],
            ['name' => 'Riad',      'status' => 'published', 'order' => 6],
        ];
        foreach ($categories as $cat) {
            DB::table('re_categories')->insert(array_merge($cat, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Features
        $features = [
            ['name' => 'Wifi',            'icon' => 'ti ti-wifi',                   'status' => 'published'],
            ['name' => 'Parking',         'icon' => 'ti ti-parking',                'status' => 'published'],
            ['name' => 'Swimming Pool',   'icon' => 'ti ti-pool',                   'status' => 'published'],
            ['name' => 'Balcony',         'icon' => 'ti ti-building-skyscraper',    'status' => 'published'],
            ['name' => 'Garden',          'icon' => 'ti ti-trees',                  'status' => 'published'],
            ['name' => 'Security',        'icon' => 'ti ti-shield-lock',            'status' => 'published'],
            ['name' => 'Fitness Center',  'icon' => 'ti ti-stretching',             'status' => 'published'],
            ['name' => 'Air Conditioning','icon' => 'ti ti-air-conditioning',       'status' => 'published'],
            ['name' => 'Central Heating', 'icon' => 'ti ti-thermometer',            'status' => 'published'],
            ['name' => 'Laundry Room',    'icon' => 'ti ti-wash-machine',           'status' => 'published'],
            ['name' => 'Pets Allowed',    'icon' => 'ti ti-paw',                    'status' => 'published'],
            ['name' => 'Spa & Massage',   'icon' => 'ti ti-bath',                   'status' => 'published'],
        ];
        foreach ($features as $f) {
            DB::table('re_features')->insert($f);
        }

        // Facilities
        $facilities = [
            ['name' => 'Hospital',   'icon' => 'ti ti-hospital',  'status' => 'published'],
            ['name' => 'School',     'icon' => 'ti ti-school',    'status' => 'published'],
            ['name' => 'Shopping',   'icon' => 'ti ti-shopping-bag', 'status' => 'published'],
            ['name' => 'Restaurant', 'icon' => 'ti ti-tools-kitchen', 'status' => 'published'],
            ['name' => 'Park',       'icon' => 'ti ti-trees',     'status' => 'published'],
            ['name' => 'Mosque',     'icon' => 'ti ti-building',  'status' => 'published'],
            ['name' => 'Beach',      'icon' => 'ti ti-beach',     'status' => 'published'],
            ['name' => 'Airport',    'icon' => 'ti ti-plane',     'status' => 'published'],
        ];
        foreach ($facilities as $f) {
            DB::table('re_facilities')->insert(array_merge($f, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Investors
        $investors = [
            ['name' => 'Horizon Group', 'status' => 'published'],
            ['name' => 'Addoha',        'status' => 'published'],
            ['name' => 'Emaar Morocco', 'status' => 'published'],
            ['name' => 'Al Omrane',     'status' => 'published'],
            ['name' => 'CIH Immo',      'status' => 'published'],
        ];
        foreach ($investors as $inv) {
            DB::table('re_investors')->insert(array_merge($inv, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Sample Agent
        DB::table('re_accounts')->insert([
            'first_name'  => 'Youssef',
            'last_name'   => 'El Amrani',
            'email'       => 'agent@homzen.ma',
            'password'    => bcrypt('password'),
            'phone'       => '+212 6 12 34 56 78',
            'is_featured' => true,
            'is_verified' => true,
            'city_id'     => 1,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        // Sample Properties
        $properties = [
            [
                'name'            => 'Villa with Pool — Ain Diab',
                'type'            => 'sale',
                'description'     => 'Stunning villa with private pool in the prestigious Ain Diab area.',
                'location'        => 'Ain Diab, Casablanca',
                'images'          => json_encode(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80']),
                'number_bedroom'  => 4,
                'number_bathroom' => 3,
                'square'          => 320,
                'price'           => 3800000,
                'is_featured'     => true,
                'featured_priority' => 10,
                'city_id'         => 1,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-001',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Modern Apartment — Maarif',
                'type'            => 'sale',
                'description'     => 'Elegant 3-bedroom apartment in the heart of Maarif.',
                'location'        => 'Maarif, Casablanca',
                'images'          => json_encode(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80']),
                'number_bedroom'  => 3,
                'number_bathroom' => 2,
                'square'          => 150,
                'price'           => 2450000,
                'is_featured'     => true,
                'featured_priority' => 9,
                'city_id'         => 1,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-002',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Luxury Villa — Hivernage',
                'type'            => 'sale',
                'description'     => 'Magnificent villa in Marrakech\'s most sought-after neighborhood.',
                'location'        => 'Hivernage, Marrakech',
                'images'          => json_encode(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80']),
                'number_bedroom'  => 5,
                'number_bathroom' => 4,
                'square'          => 450,
                'price'           => 5600000,
                'is_featured'     => false,
                'city_id'         => 2,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-003',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Contemporary Apartment — Agdal',
                'type'            => 'rent',
                'description'     => 'Bright 2-bedroom apartment with modern finishes.',
                'location'        => 'Agdal, Rabat',
                'images'          => json_encode(['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80']),
                'number_bedroom'  => 2,
                'number_bathroom' => 2,
                'square'          => 120,
                'price'           => 9500,
                'is_featured'     => false,
                'city_id'         => 3,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-004',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Penthouse — Hassan II Avenue',
                'type'            => 'sale',
                'description'     => 'Exceptional penthouse with panoramic city views.',
                'location'        => 'Hassan II, Casablanca',
                'images'          => json_encode(['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80']),
                'number_bedroom'  => 4,
                'number_bathroom' => 3,
                'square'          => 280,
                'price'           => 4200000,
                'is_featured'     => true,
                'featured_priority' => 8,
                'city_id'         => 1,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-005',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Riad — Médina',
                'type'            => 'sale',
                'description'     => 'Traditional riad fully restored with modern comforts.',
                'location'        => 'Médina, Marrakech',
                'images'          => json_encode(['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80']),
                'number_bedroom'  => 5,
                'number_bathroom' => 4,
                'square'          => 380,
                'price'           => 3100000,
                'is_featured'     => false,
                'city_id'         => 2,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-006',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Sea View Apartment — Corniche',
                'type'            => 'sale',
                'description'     => 'Stunning sea views from this modern apartment on the Corniche.',
                'location'        => 'Corniche, Tanger',
                'images'          => json_encode(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']),
                'number_bedroom'  => 3,
                'number_bathroom' => 2,
                'square'          => 170,
                'price'           => 2800000,
                'is_featured'     => false,
                'city_id'         => 4,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-007',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'name'            => 'Modern Villa — Souissi',
                'type'            => 'sale',
                'description'     => 'Prestigious villa in Rabat\'s most exclusive residential area.',
                'location'        => 'Souissi, Rabat',
                'images'          => json_encode(['https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800&q=80']),
                'number_bedroom'  => 6,
                'number_bathroom' => 5,
                'square'          => 520,
                'price'           => 6500000,
                'is_featured'     => true,
                'featured_priority' => 7,
                'city_id'         => 3,
                'country_id'      => 1,
                'status'          => 'selling',
                'moderation_status' => 'approved',
                'author_id'       => 1,
                'unique_id'       => 'PROP-008',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
        ];

        foreach ($properties as $prop) {
            DB::table('re_properties')->insert($prop);
        }

        // Slugs for properties
        $slugMap = [
            1 => 'villa-with-pool-ain-diab',
            2 => 'modern-apartment-maarif',
            3 => 'luxury-villa-hivernage',
            4 => 'contemporary-apartment-agdal',
            5 => 'penthouse-hassan-ii-avenue',
            6 => 'riad-medina',
            7 => 'sea-view-apartment-corniche',
            8 => 'modern-villa-souissi',
        ];
        foreach ($slugMap as $id => $key) {
            DB::table('slugs')->insert([
                'key'            => $key,
                'reference_id'   => $id,
                'reference_type' => 'Botble\\RealEstate\\Models\\Property',
                'prefix'         => 'properties',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }

        // Property features (first 3 properties get features)
        $propFeatures = [[1,1],[1,2],[1,3],[1,4],[2,1],[2,7],[2,8],[3,3],[3,5],[3,6],[5,1],[5,2],[5,7],[8,3],[8,5],[8,6]];
        foreach ($propFeatures as [$pid, $fid]) {
            DB::table('re_property_features')->insert(['property_id' => $pid, 'feature_id' => $fid]);
        }

        // Property categories
        DB::table('re_property_categories')->insert(['property_id' => 1, 'category_id' => 2]); // Villa
        DB::table('re_property_categories')->insert(['property_id' => 2, 'category_id' => 1]); // Apartment
        DB::table('re_property_categories')->insert(['property_id' => 3, 'category_id' => 2]); // Villa
        DB::table('re_property_categories')->insert(['property_id' => 4, 'category_id' => 1]); // Apartment
        DB::table('re_property_categories')->insert(['property_id' => 5, 'category_id' => 1]); // Apartment
        DB::table('re_property_categories')->insert(['property_id' => 6, 'category_id' => 6]); // Riad
        DB::table('re_property_categories')->insert(['property_id' => 7, 'category_id' => 1]); // Apartment
        DB::table('re_property_categories')->insert(['property_id' => 8, 'category_id' => 2]); // Villa

        // Sample Projects
        $projects = [
            [
                'name'        => 'The View Anfa',
                'description' => 'Luxury living in the heart of Casablanca',
                'images'      => json_encode(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80']),
                'investor_id' => 1,
                'is_featured' => true,
                'featured_priority' => 10,
                'price_from'  => 1450000,
                'price_to'    => 4500000,
                'city_id'     => 1,
                'country_id'  => 1,
                'status'      => 'selling',
                'author_id'   => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Résidences Mascotte',
                'description' => 'Premium Apartments — Hivernage, Marrakech',
                'images'      => json_encode(['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80']),
                'investor_id' => 2,
                'is_featured' => true,
                'featured_priority' => 9,
                'price_from'  => 980000,
                'price_to'    => 2800000,
                'city_id'     => 2,
                'country_id'  => 1,
                'status'      => 'selling',
                'author_id'   => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Marina Living',
                'description' => 'Waterfront Apartments — Bouregreg, Rabat',
                'images'      => json_encode(['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80']),
                'investor_id' => 3,
                'is_featured' => false,
                'price_from'  => 2100000,
                'price_to'    => 5200000,
                'city_id'     => 3,
                'country_id'  => 1,
                'status'      => 'selling',
                'author_id'   => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Noria Golf City',
                'description' => 'Villas by the Golf Course',
                'images'      => json_encode(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80']),
                'investor_id' => 4,
                'is_featured' => false,
                'price_from'  => 3900000,
                'price_to'    => 9500000,
                'city_id'     => 1,
                'country_id'  => 1,
                'status'      => 'selling',
                'author_id'   => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ];

        foreach ($projects as $proj) {
            DB::table('re_projects')->insert($proj);
        }

        // Project slugs
        $projSlugMap = [
            1 => 'the-view-anfa',
            2 => 'residences-mascotte',
            3 => 'marina-living',
            4 => 'noria-golf-city',
        ];
        foreach ($projSlugMap as $id => $key) {
            DB::table('slugs')->insert([
                'key'            => $key,
                'reference_id'   => $id,
                'reference_type' => 'Botble\\RealEstate\\Models\\Project',
                'prefix'         => 'projects',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('re_consults')->truncate();
        DB::table('re_reviews')->truncate();
        DB::table('re_project_categories')->truncate();
        DB::table('re_project_features')->truncate();
        DB::table('re_property_categories')->truncate();
        DB::table('re_property_features')->truncate();
        DB::table('slugs')->truncate();
        DB::table('re_projects')->truncate();
        DB::table('re_properties')->truncate();
        DB::table('re_accounts')->truncate();
        DB::table('re_investors')->truncate();
        DB::table('re_facilities')->truncate();
        DB::table('re_features')->truncate();
        DB::table('re_categories')->truncate();
        DB::table('cities')->truncate();
        DB::table('states')->truncate();
        DB::table('countries')->truncate();
    }
};
