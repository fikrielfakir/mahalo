<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cities')->truncate();
        DB::table('states')->truncate();
        DB::table('countries')->truncate();

        $countries = [
            ['id' => 1,  'name' => 'France',        'code' => 'FR', 'nationality' => 'French'],
            ['id' => 2,  'name' => 'England',        'code' => 'GB', 'nationality' => 'British'],
            ['id' => 3,  'name' => 'United States',  'code' => 'US', 'nationality' => 'American'],
            ['id' => 4,  'name' => 'Netherlands',    'code' => 'NL', 'nationality' => 'Dutch'],
            ['id' => 5,  'name' => 'Denmark',        'code' => 'DK', 'nationality' => 'Danish'],
            ['id' => 6,  'name' => 'Germany',        'code' => 'DE', 'nationality' => 'German'],
            ['id' => 7,  'name' => 'Japan',          'code' => 'JP', 'nationality' => 'Japanese'],
            ['id' => 8,  'name' => 'Canada',         'code' => 'CA', 'nationality' => 'Canadian'],
            ['id' => 9,  'name' => 'Australia',      'code' => 'AU', 'nationality' => 'Australian'],
            ['id' => 10, 'name' => 'Italy',          'code' => 'IT', 'nationality' => 'Italian'],
        ];

        DB::table('countries')->insert(array_map(fn($c) => array_merge($c, [
            'status' => 'published', 'order' => 0, 'is_default' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]), $countries));

        $states = [
            ['id' => 1,  'name' => 'France',         'slug' => 'france',          'abbreviation' => 'FR',  'country_id' => 1,  'image' => 'locations/5.jpg'],
            ['id' => 2,  'name' => 'England',         'slug' => 'england',         'abbreviation' => 'EN',  'country_id' => 2,  'image' => 'locations/3.jpg'],
            ['id' => 3,  'name' => 'New York',        'slug' => 'new-york',        'abbreviation' => 'NY',  'country_id' => 3,  'image' => 'locations/4.jpg'],
            ['id' => 4,  'name' => 'Holland',         'slug' => 'holland',         'abbreviation' => 'HL',  'country_id' => 4,  'image' => 'locations/3.jpg'],
            ['id' => 5,  'name' => 'Denmark',         'slug' => 'denmark',         'abbreviation' => 'DN',  'country_id' => 5,  'image' => 'locations/5.jpg'],
            ['id' => 6,  'name' => 'Bavaria',         'slug' => 'bavaria',         'abbreviation' => 'BY',  'country_id' => 6,  'image' => 'locations/3.jpg'],
            ['id' => 7,  'name' => 'Tokyo',           'slug' => 'tokyo',           'abbreviation' => 'TK',  'country_id' => 7,  'image' => 'locations/4.jpg'],
            ['id' => 8,  'name' => 'Ontario',         'slug' => 'ontario',         'abbreviation' => 'ON',  'country_id' => 8,  'image' => 'locations/4.jpg'],
            ['id' => 9,  'name' => 'New South Wales', 'slug' => 'new-south-wales', 'abbreviation' => 'NSW', 'country_id' => 9,  'image' => 'locations/3.jpg'],
            ['id' => 10, 'name' => 'Lombardy',        'slug' => 'lombardy',        'abbreviation' => 'LO',  'country_id' => 10, 'image' => 'locations/4.jpg'],
        ];

        DB::table('states')->insert(array_map(fn($s) => array_merge($s, [
            'order' => 0, 'is_default' => 0, 'status' => 'published',
            'created_at' => now(), 'updated_at' => now(),
        ]), $states));

        $cities = [
            ['id' => 1,  'name' => 'Paris',         'slug' => 'paris',         'state_id' => 1,  'country_id' => 1],
            ['id' => 2,  'name' => 'Lyon',           'slug' => 'lyon',          'state_id' => 1,  'country_id' => 1],
            ['id' => 3,  'name' => 'Marseille',      'slug' => 'marseille',     'state_id' => 1,  'country_id' => 1],
            ['id' => 4,  'name' => 'London',         'slug' => 'london',        'state_id' => 2,  'country_id' => 2],
            ['id' => 5,  'name' => 'Manchester',     'slug' => 'manchester',    'state_id' => 2,  'country_id' => 2],
            ['id' => 6,  'name' => 'New York City',  'slug' => 'new-york-city', 'state_id' => 3,  'country_id' => 3],
            ['id' => 7,  'name' => 'Buffalo',        'slug' => 'buffalo',       'state_id' => 3,  'country_id' => 3],
            ['id' => 8,  'name' => 'Amsterdam',      'slug' => 'amsterdam',     'state_id' => 4,  'country_id' => 4],
            ['id' => 9,  'name' => 'Rotterdam',      'slug' => 'rotterdam',     'state_id' => 4,  'country_id' => 4],
            ['id' => 10, 'name' => 'Copenhagen',     'slug' => 'copenhagen',    'state_id' => 5,  'country_id' => 5],
            ['id' => 11, 'name' => 'Aarhus',         'slug' => 'aarhus',        'state_id' => 5,  'country_id' => 5],
            ['id' => 12, 'name' => 'Munich',         'slug' => 'munich',        'state_id' => 6,  'country_id' => 6],
            ['id' => 13, 'name' => 'Nuremberg',      'slug' => 'nuremberg',     'state_id' => 6,  'country_id' => 6],
            ['id' => 14, 'name' => 'Tokyo',          'slug' => 'tokyo-city',    'state_id' => 7,  'country_id' => 7],
            ['id' => 15, 'name' => 'Osaka',          'slug' => 'osaka',         'state_id' => 7,  'country_id' => 7],
            ['id' => 16, 'name' => 'Toronto',        'slug' => 'toronto',       'state_id' => 8,  'country_id' => 8],
            ['id' => 17, 'name' => 'Ottawa',         'slug' => 'ottawa',        'state_id' => 8,  'country_id' => 8],
            ['id' => 18, 'name' => 'Hamilton',       'slug' => 'hamilton',      'state_id' => 8,  'country_id' => 8],
            ['id' => 19, 'name' => 'Sydney',         'slug' => 'sydney',        'state_id' => 9,  'country_id' => 9],
            ['id' => 20, 'name' => 'Newcastle',      'slug' => 'newcastle',     'state_id' => 9,  'country_id' => 9],
            ['id' => 21, 'name' => 'Wollongong',     'slug' => 'wollongong',    'state_id' => 9,  'country_id' => 9],
            ['id' => 22, 'name' => 'Milan',          'slug' => 'milan',         'state_id' => 10, 'country_id' => 10],
            ['id' => 23, 'name' => 'Brescia',        'slug' => 'brescia',       'state_id' => 10, 'country_id' => 10],
            ['id' => 24, 'name' => 'Bergamo',        'slug' => 'bergamo',       'state_id' => 10, 'country_id' => 10],
            ['id' => 25, 'name' => 'Bordeaux',       'slug' => 'bordeaux',      'state_id' => 1,  'country_id' => 1],
            ['id' => 26, 'name' => 'Liverpool',      'slug' => 'liverpool',     'state_id' => 2,  'country_id' => 2],
            ['id' => 27, 'name' => 'Vancouver',      'slug' => 'vancouver',     'state_id' => 8,  'country_id' => 8],
        ];

        DB::table('cities')->insert(array_map(fn($c) => array_merge($c, [
            'order' => 0, 'is_default' => 0, 'status' => 'published', 'image' => null,
            'created_at' => now(), 'updated_at' => now(),
        ]), $cities));
    }
}
