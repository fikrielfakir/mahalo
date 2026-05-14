<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_property_features')->truncate();
        DB::table('re_property_categories')->truncate();
        DB::table('re_facilities_distances')->where('reference_type', 'Botble\\RealEstate\\Models\\Property')->delete();
        DB::table('slugs')->where('reference_type', 'Botble\\RealEstate\\Models\\Property')->delete();
        Property::truncate();

        $propertyNames = [
            '3 Beds Villa Calpe, Alicante',
            'Lavida Plus Office-tel 1 Bedroom',
            'Vinhomes Grand Park Studio 1 Bedroom',
            'The Sun Avenue Office-tel 1 Bedroom',
            'Property For sale, Johannesburg, South Africa',
            'Stunning French Inspired Manor',
            'Villa for sale at Bermuda Dunes',
            'Walnut Park Apartment',
            '5 beds luxury house',
            'Family Victorian "View" Home',
            'Osaka Heights Apartment',
            'Private Estate Magnificent Views',
            'Thompson Road House for rent',
            'Brand New 1 Bedroom Apartment In First Class Location',
            'Elegant family home presents premium modern living',
            'Luxury Apartments in Singapore for Sale',
            '5 room luxury penthouse for sale in Kuala Lumpur',
            '2 Floor house in Compound Pejaten Barat Kemang',
            'Apartment Muiderstraatweg in Diemen',
            'Nice Apartment for rent in Berlin',
            'Pumpkin Key - Private Island',
            'Maplewood Estates',
            'Pine Ridge Manor',
            'Oak Hill Residences',
            'Sunnybrook Villas',
            'Riverstone Condominiums',
            'Cedar Park Apartments',
            'Lakeside Retreat',
            'Willow Creek Homes',
            'Grandview Heights',
            'Forest Glen Cottages',
            'Harborview Towers',
            'Meadowlands Estates',
            'Highland Meadows',
            'Brookfield Gardens',
            'Silverwood Villas',
            'Evergreen Terrace',
            'Golden Gate Residences',
            'Spring Blossom Park',
            'Horizon Pointe',
            'Whispering Pines Lodge',
            'Sunset Ridge',
            'Timberline Estates',
            'Crystal Lake Condos',
            'Briarwood Apartments',
            'Summit View',
            'Elmwood Park',
            'Stonegate Homes',
            'Rosewood Villas',
            'Prairie Meadows',
            'Hawthorne Heights',
            'Sierra Vista',
            'Autumn Leaves',
            'Blue Sky Residences',
            'Pebble Creek',
            'Magnolia Manor',
            'Cherry Blossom Estates',
            'Windsor Park',
            'Seaside Villas',
            'Mountain View Retreat',
            'Amberwood Apartments',
        ];

        $descriptions = [
            'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.',
            'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.',
            'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.',
            'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.',
            'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.',
            'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.',
            'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.',
            'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.',
        ];

        $content = 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.';

        $locations = [
            '123 Oak Street, Riverside Heights',
            '456 Maple Avenue, Downtown District',
            '789 Pine Road, Garden Quarter',
            '321 Cedar Lane, Lakeside Park',
            '654 Birch Boulevard, Sunset Hills',
            '987 Elm Drive, Mountain View',
            '147 Willow Way, Harbor Point',
            '258 Spruce Court, Valley Green',
            '369 Ash Circle, Meadow Springs',
            '741 Hickory Place, Forest Glen',
        ];

        $floorPlans = json_encode([
            [
                ['key' => 'name',      'value' => 'First Floor'],
                ['key' => 'bedrooms',  'value' => '3'],
                ['key' => 'bathrooms', 'value' => '2'],
                ['key' => 'image',     'value' => 'properties/floor.png'],
            ],
            [
                ['key' => 'name',      'value' => 'Second Floor'],
                ['key' => 'bedrooms',  'value' => '2'],
                ['key' => 'bathrooms', 'value' => '1'],
                ['key' => 'image',     'value' => 'properties/floor.png'],
            ],
        ]);

        $cityStateCountry = [
            [6,  3,  3],  [4,  2,  2],  [1,  1,  1],  [8,  4,  4],
            [12, 6,  6],  [22, 10, 10], [14, 7,  7],  [16, 8,  8],
            [19, 9,  9],  [10, 5,  5],  [6,  3,  3],  [4,  2,  2],
            [1,  1,  1],  [8,  4,  4],  [12, 6,  6],  [22, 10, 10],
            [14, 7,  7],  [16, 8,  8],  [19, 9,  9],  [10, 5,  5],
            [6,  3,  3],  [4,  2,  2],  [1,  1,  1],  [8,  4,  4],
            [12, 6,  6],  [22, 10, 10], [14, 7,  7],  [16, 8,  8],
            [19, 9,  9],  [10, 5,  5],  [6,  3,  3],  [4,  2,  2],
            [1,  1,  1],  [8,  4,  4],  [12, 6,  6],  [22, 10, 10],
            [14, 7,  7],  [16, 8,  8],  [19, 9,  9],  [10, 5,  5],
            [6,  3,  3],  [4,  2,  2],  [1,  1,  1],  [8,  4,  4],
            [12, 6,  6],  [22, 10, 10], [14, 7,  7],  [16, 8,  8],
            [19, 9,  9],  [10, 5,  5],  [6,  3,  3],  [4,  2,  2],
            [1,  1,  1],  [8,  4,  4],  [12, 6,  6],  [22, 10, 10],
            [14, 7,  7],  [16, 8,  8],  [19, 9,  9],  [10, 5,  5],
        ];

        $accountIds = range(1, 12);

        foreach ($propertyNames as $idx => $name) {
            $type       = $idx % 3 === 0 ? 'rent' : 'sale';
            $status     = $type === 'rent' ? 'renting' : 'selling';
            $price      = rand(100, 10000) * 100;
            $bedrooms   = rand(1, 6);
            $bathrooms  = rand(1, 4);
            $square     = rand(50, 500);
            $accountId  = $accountIds[$idx % count($accountIds)];
            $loc        = $cityStateCountry[$idx] ?? [6, 3, 3];
            $imgNums    = array_rand(array_flip(range(1, 12)), rand(5, 10));
            $images     = array_map(fn($n) => "properties/{$n}.jpg", (array) $imgNums);

            $imagesSets = [
                '["properties/1.jpg","properties/2.jpg","properties/3.jpg","properties/4.jpg","properties/9.jpg","properties/10.jpg","properties/11.jpg","properties/12.jpg"]',
                '["properties/5.jpg","properties/6.jpg","properties/7.jpg","properties/8.jpg","properties/1.jpg","properties/3.jpg","properties/11.jpg"]',
                '["properties/2.jpg","properties/4.jpg","properties/6.jpg","properties/8.jpg","properties/10.jpg","properties/12.jpg"]',
                '["properties/1.jpg","properties/3.jpg","properties/5.jpg","properties/7.jpg","properties/9.jpg","properties/11.jpg"]',
            ];

            $slug = Str::slug($name);

            $property = Property::create([
                'name'              => $name,
                'type'              => $type,
                'description'       => $descriptions[$idx % count($descriptions)],
                'content'           => $content,
                'location'          => $locations[$idx % count($locations)],
                'images'            => $imagesSets[$idx % count($imagesSets)],
                'floor_plans'       => $floorPlans,
                'project_id'        => ($idx % 5 === 0) ? (($idx % 18) + 1) : 0,
                'number_bedroom'    => $bedrooms,
                'number_bathroom'   => $bathrooms,
                'number_floor'      => rand(1, 50),
                'square'            => $square,
                'price'             => $price,
                'currency_id'       => 1,
                'is_featured'       => $idx < 8 ? 1 : 0,
                'featured_priority' => $idx < 8 ? (8 - $idx) : 0,
                'city_id'           => $loc[0],
                'state_id'          => $loc[1],
                'country_id'        => $loc[2],
                'period'            => $type === 'rent' ? 'month' : 'month',
                'status'            => $status,
                'author_id'         => $accountId,
                'author_type'       => 'Botble\\RealEstate\\Models\\Account',
                'moderation_status' => 'approved',
                'expire_date'       => now()->addDays(rand(30, 365))->toDateString(),
                'never_expired'     => 1,
                'latitude'          => sprintf('%.4f', 42.4772 + (rand(0, 15000) / 10000)),
                'longitude'         => sprintf('%.4f', -76.7517 + (rand(0, 20000) / 10000)),
                'views'             => rand(0, 100000),
                'unique_id'         => strtoupper(Str::random(6)),
            ]);

            DB::table('slugs')->insert([
                'key'            => $slug,
                'reference_id'   => $property->id,
                'reference_type' => 'Botble\\RealEstate\\Models\\Property',
                'prefix'         => 'properties',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            $catIds   = array_slice(range(1, 6), 0, rand(1, 3));
            shuffle($catIds);
            foreach ($catIds as $catId) {
                DB::table('re_property_categories')->insertOrIgnore([
                    'property_id' => $property->id,
                    'category_id' => $catId,
                ]);
            }

            $featIds = array_rand(array_flip(range(1, 12)), rand(4, 10));
            foreach ((array) $featIds as $featId) {
                DB::table('re_property_features')->insert([
                    'property_id' => $property->id,
                    'feature_id'  => $featId,
                ]);
            }

            for ($f = 1; $f <= 11; $f++) {
                DB::table('re_facilities_distances')->insert([
                    'reference_id'   => $property->id,
                    'reference_type' => 'Botble\\RealEstate\\Models\\Property',
                    'facility_id'    => $f,
                    'distance'       => rand(1, 20) . 'km',
                ]);
            }
        }
    }
}
