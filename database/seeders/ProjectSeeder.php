<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_project_categories')->truncate();
        DB::table('re_project_features')->truncate();
        DB::table('re_facilities_distances')->where('reference_type', 'Botble\\RealEstate\\Models\\Project')->delete();
        DB::table('slugs')->where('reference_type', 'Botble\\RealEstate\\Models\\Project')->delete();
        Project::truncate();

        $contentLong = 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.';

        $projects = [
            ['name' => 'Walnut Park Apartments',        'slug' => 'walnut-park-apartments',         'city_id' => 6,  'state_id' => 3,  'country_id' => 3,  'investor_id' => 11, 'status' => 'selling',  'is_featured' => 1, 'lat' => '42.4836', 'lng' => '-75.8423', 'price_from' => 9741,   'price_to' => 13969,  'location' => '50 Riverside Way, Marina District'],
            ['name' => 'Sunshine Wonder Villas',        'slug' => 'sunshine-wonder-villas',         'city_id' => 4,  'state_id' => 2,  'country_id' => 2,  'investor_id' => 3,  'status' => 'selling',  'is_featured' => 1, 'lat' => '42.5101', 'lng' => '-75.6234', 'price_from' => 12500,  'price_to' => 25000,  'location' => '250 Parkview Boulevard, Central Heights'],
            ['name' => 'Diamond Island',                'slug' => 'diamond-island',                 'city_id' => 19, 'state_id' => 9,  'country_id' => 9,  'investor_id' => 9,  'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5234', 'lng' => '-75.7145', 'price_from' => 8200,   'price_to' => 18500,  'location' => '75 Harbor Gateway, Waterfront Quarter'],
            ['name' => 'The Nassim',                    'slug' => 'the-nassim',                     'city_id' => 22, 'state_id' => 10, 'country_id' => 10, 'investor_id' => 2,  'status' => 'selling',  'is_featured' => 1, 'lat' => '42.4901', 'lng' => '-75.9012', 'price_from' => 20000,  'price_to' => 45000,  'location' => '400 Skyline Avenue, Downtown Core'],
            ['name' => 'Vinhomes Grand Park',           'slug' => 'vinhomes-grand-park',            'city_id' => 16, 'state_id' => 8,  'country_id' => 8,  'investor_id' => 8,  'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5567', 'lng' => '-75.5234', 'price_from' => 5500,   'price_to' => 12000,  'location' => '180 Garden Terrace, Green Valley'],
            ['name' => 'The Metropole Thu Thiem',       'slug' => 'the-metropole-thu-thiem',        'city_id' => 1,  'state_id' => 1,  'country_id' => 1,  'investor_id' => 5,  'status' => 'selling',  'is_featured' => 1, 'lat' => '42.4712', 'lng' => '-75.8901', 'price_from' => 15000,  'price_to' => 35000,  'location' => '320 Summit Road, Highland Park'],
            ['name' => 'Villa on Grand Avenue',         'slug' => 'villa-on-grand-avenue',          'city_id' => 8,  'state_id' => 4,  'country_id' => 4,  'investor_id' => 4,  'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5123', 'lng' => '-75.6789', 'price_from' => 18000,  'price_to' => 30000,  'location' => '100 Innovation Drive, Tech District'],
            ['name' => 'Traditional Food Restaurant',   'slug' => 'traditional-food-restaurant',    'city_id' => 12, 'state_id' => 6,  'country_id' => 6,  'investor_id' => 7,  'status' => 'selling',  'is_featured' => 0, 'lat' => '42.4856', 'lng' => '-75.7234', 'price_from' => 6000,   'price_to' => 10000,  'location' => '600 Metropolitan Center, Business Hub'],
            ['name' => 'Villa on Hollywood Boulevard',  'slug' => 'villa-on-hollywood-boulevard',   'city_id' => 6,  'state_id' => 3,  'country_id' => 3,  'investor_id' => 1,  'status' => 'selling',  'is_featured' => 1, 'lat' => '42.5345', 'lng' => '-75.5901', 'price_from' => 25000,  'price_to' => 50000,  'location' => '654 Birch Boulevard, Sunset Hills'],
            ['name' => 'Office Space at Northwest 107th','slug' => 'office-space-at-northwest-107th','city_id' => 4,  'state_id' => 2,  'country_id' => 2,  'investor_id' => 6,  'status' => 'pre-sale', 'is_featured' => 0, 'lat' => '42.5678', 'lng' => '-75.4567', 'price_from' => 9000,   'price_to' => 18000,  'location' => '987 Elm Drive, Mountain View'],
            ['name' => 'Home in Merrick Way',           'slug' => 'home-in-merrick-way',            'city_id' => 19, 'state_id' => 9,  'country_id' => 9,  'investor_id' => 14, 'status' => 'selling',  'is_featured' => 0, 'lat' => '42.4934', 'lng' => '-75.8234', 'price_from' => 7500,   'price_to' => 14000,  'location' => '147 Willow Way, Harbor Point'],
            ['name' => 'Adarsh Greens',                 'slug' => 'adarsh-greens',                  'city_id' => 22, 'state_id' => 10, 'country_id' => 10, 'investor_id' => 10, 'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5012', 'lng' => '-75.7456', 'price_from' => 11000,  'price_to' => 22000,  'location' => '258 Spruce Court, Valley Green'],
            ['name' => 'Rustomjee Evershine Global City','slug' => 'rustomjee-evershine-global-city','city_id' => 16, 'state_id' => 8,  'country_id' => 8,  'investor_id' => 12, 'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5289', 'lng' => '-75.6123', 'price_from' => 8800,   'price_to' => 19500,  'location' => '369 Ash Circle, Meadow Springs'],
            ['name' => 'Godrej Exquisite',              'slug' => 'godrej-exquisite',               'city_id' => 1,  'state_id' => 1,  'country_id' => 1,  'investor_id' => 13, 'status' => 'selling',  'is_featured' => 0, 'lat' => '42.4789', 'lng' => '-75.8678', 'price_from' => 14000,  'price_to' => 28000,  'location' => '741 Hickory Place, Forest Glen'],
            ['name' => 'Godrej Prime',                  'slug' => 'godrej-prime',                   'city_id' => 8,  'state_id' => 4,  'country_id' => 4,  'investor_id' => 13, 'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5456', 'lng' => '-75.5345', 'price_from' => 16500,  'price_to' => 32000,  'location' => '456 Maple Avenue, Downtown District'],
            ['name' => 'PS Panache',                    'slug' => 'ps-panache',                     'city_id' => 12, 'state_id' => 6,  'country_id' => 6,  'investor_id' => 2,  'status' => 'pre-sale', 'is_featured' => 0, 'lat' => '42.4623', 'lng' => '-75.9234', 'price_from' => 10500,  'price_to' => 21000,  'location' => '123 Oak Street, Riverside Heights'],
            ['name' => 'Upturn Atmiya Centria',         'slug' => 'upturn-atmiya-centria',          'city_id' => 6,  'state_id' => 3,  'country_id' => 3,  'investor_id' => 6,  'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5156', 'lng' => '-75.7012', 'price_from' => 7200,   'price_to' => 15500,  'location' => '321 Cedar Lane, Lakeside Park'],
            ['name' => 'Brigade Oasis',                 'slug' => 'brigade-oasis',                  'city_id' => 19, 'state_id' => 9,  'country_id' => 9,  'investor_id' => 9,  'status' => 'selling',  'is_featured' => 0, 'lat' => '42.5389', 'lng' => '-75.5678', 'price_from' => 13000,  'price_to' => 27000,  'location' => '654 Birch Boulevard, Sunset Hills'],
        ];

        $descriptions = [
            'Luxury living redefined with world-class facilities, stunning architecture, and convenient access to urban conveniences.',
            'An innovative mixed-use development combining residential comfort with commercial convenience in a vibrant community setting.',
            'A premier residential development offering modern living with exceptional amenities and thoughtful design in a prime location.',
            'Experience elevated living in this thoughtfully planned community featuring green spaces, modern homes, and premium amenities.',
            'A landmark development setting new standards for quality construction, sustainable design, and community living.',
            'Premium residences designed for discerning homeowners who appreciate quality, location, and lifestyle excellence.',
        ];

        $imagesSets = [
            '["properties/1.jpg","properties/4.jpg","properties/5.jpg","properties/6.jpg","properties/7.jpg","properties/10.jpg","properties/11.jpg"]',
            '["properties/2.jpg","properties/3.jpg","properties/5.jpg","properties/7.jpg","properties/8.jpg","properties/9.jpg","properties/12.jpg"]',
            '["properties/1.jpg","properties/2.jpg","properties/6.jpg","properties/8.jpg","properties/10.jpg","properties/11.jpg"]',
            '["properties/3.jpg","properties/4.jpg","properties/5.jpg","properties/9.jpg","properties/10.jpg","properties/12.jpg"]',
        ];

        $categoryMap = [
            1 => [5], 2 => [3, 6], 3 => [1, 3, 5], 4 => [6], 5 => [6], 6 => [6],
            7 => [2, 4, 5], 8 => [3, 4, 6], 9 => [1], 10 => [1, 6], 11 => [5],
            12 => [4, 5, 6], 13 => [1, 3, 5], 14 => [1, 2, 5], 15 => [2, 5, 6],
            16 => [2, 5, 6], 17 => [1, 3, 4], 18 => [2, 5],
        ];

        $featureMap = [
            1 => [1, 8, 9, 12], 2 => [2, 3, 5, 6, 7, 8, 9, 10, 11, 12], 3 => [1, 2, 3, 4, 5, 6, 7, 8, 10],
            4 => [4, 6, 9, 11], 5 => [1, 2, 3, 5, 6, 7, 10, 12], 6 => [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12],
            7 => [3, 4, 5, 7, 8, 9, 10, 11], 8 => [1, 2, 3, 6, 10, 11], 9 => [1, 2, 5, 9, 11],
            10 => [1, 3, 5, 6, 8, 10, 12], 11 => [1, 2, 8, 10], 12 => [1, 2, 3, 4, 6, 7, 8, 9, 10, 12],
            13 => [1, 3, 6, 9, 10], 14 => [2, 3, 4, 5, 6, 8, 10], 15 => [1, 2, 7, 9, 10, 12],
            16 => [1, 4, 7, 8, 9, 11, 12], 17 => [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            18 => [1, 3, 4, 5, 6, 7, 10, 12],
        ];

        foreach ($projects as $idx => $p) {
            $id = $idx + 1;

            $project = Project::create([
                'name'            => $p['name'],
                'description'     => $descriptions[$idx % count($descriptions)],
                'content'         => $contentLong,
                'images'          => $imagesSets[$idx % count($imagesSets)],
                'location'        => $p['location'],
                'investor_id'     => $p['investor_id'],
                'number_block'    => rand(2, 10),
                'number_floor'    => rand(5, 50),
                'number_flat'     => rand(20, 1500),
                'is_featured'     => $p['is_featured'],
                'featured_priority' => $p['is_featured'] ? rand(1, 10) : 0,
                'date_finish'     => now()->addMonths(rand(6, 36))->toDateString(),
                'date_sell'       => now()->subMonths(rand(1, 12))->toDateString(),
                'price_from'      => $p['price_from'],
                'price_to'        => $p['price_to'],
                'currency_id'     => 1,
                'city_id'         => $p['city_id'],
                'state_id'        => $p['state_id'],
                'country_id'      => $p['country_id'],
                'status'          => $p['status'],
                'author_id'       => 1,
                'author_type'     => 'Botble\\ACL\\Models\\User',
                'latitude'        => $p['lat'],
                'longitude'       => $p['lng'],
                'views'           => rand(100, 10000),
                'unique_id'       => strtoupper(Str::random(6)),
            ]);

            DB::table('slugs')->insert([
                'key'            => $p['slug'],
                'reference_id'   => $project->id,
                'reference_type' => 'Botble\\RealEstate\\Models\\Project',
                'prefix'         => 'projects',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            if (isset($categoryMap[$id])) {
                foreach ($categoryMap[$id] as $catId) {
                    DB::table('re_project_categories')->insert([
                        'project_id'  => $project->id,
                        'category_id' => $catId,
                    ]);
                }
            }

            if (isset($featureMap[$id])) {
                foreach ($featureMap[$id] as $featId) {
                    DB::table('re_project_features')->insert([
                        'project_id' => $project->id,
                        'feature_id' => $featId,
                    ]);
                }
            }

            for ($f = 1; $f <= 11; $f++) {
                DB::table('re_facilities_distances')->insert([
                    'reference_id'   => $project->id,
                    'reference_type' => 'Botble\\RealEstate\\Models\\Project',
                    'facility_id'    => $f,
                    'distance'       => rand(1, 20) . 'km',
                ]);
            }
        }
    }
}
