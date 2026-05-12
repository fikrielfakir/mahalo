<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_reviews')->truncate();

        $reviews = [
            ['account_id' => 1, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 1,  'star' => 5, 'content' => 'Absolutely stunning property! The photos did not do it justice. Well worth the price.'],
            ['account_id' => 2, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 1,  'star' => 4, 'content' => 'Great location and beautiful design. A few minor things to fix but overall very happy.'],
            ['account_id' => 3, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 2,  'star' => 5, 'content' => 'Modern, spacious, and well-located. Exactly what we were looking for.'],
            ['account_id' => 4, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 3,  'star' => 4, 'content' => 'Good value for money. The neighborhood is quiet and safe.'],
            ['account_id' => 5, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 4,  'star' => 5, 'content' => 'Premium finishes throughout. The kitchen and bathrooms are exceptional.'],
            ['account_id' => 1, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Project',  'reviewable_id' => 1,  'star' => 5, 'content' => 'World-class development with top-tier amenities. Very impressed with the build quality.'],
            ['account_id' => 3, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Project',  'reviewable_id' => 2,  'star' => 4, 'content' => 'Great community vibe. The shared spaces are beautifully maintained.'],
            ['account_id' => 6, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 5,  'star' => 3, 'content' => 'Good property but a bit overpriced for the area. Nice views though.'],
            ['account_id' => 7, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 6,  'star' => 5, 'content' => 'This is our dream home. The garden is magnificent and the layout is perfect for families.'],
            ['account_id' => 8, 'reviewable_type' => 'Botble\\RealEstate\\Models\\Property', 'reviewable_id' => 7,  'star' => 4, 'content' => 'Lovely villa with great pool area. Very private and secure.'],
        ];

        foreach ($reviews as $r) {
            DB::table('re_reviews')->insert(array_merge($r, [
                'status'     => 'approved',
                'created_at' => now()->subDays(rand(1, 90)),
                'updated_at' => now(),
            ]));
        }
    }
}
