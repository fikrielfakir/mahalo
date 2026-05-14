<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('testimonials')->truncate();

        DB::table('testimonials')->insert([
            [
                'id'         => 1,
                'name'       => 'Jennifer Lee',
                'content'    => 'From the initial consultation to closing day, the real estate team went above and beyond to ensure I found the perfect home. Their dedication and professionalism made the entire process seamless. Thank you!',
                'image'      => 'avatars/4.jpg',
                'company'    => 'Happy Home Seeker',
                'status'     => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 2,
                'name'       => 'Robert Evans',
                'content'    => 'I am impressed by the level of expertise and commitment demonstrated by this real estate team. Their insights into the market helped me make informed investment decisions, and I couldn\'t be happier with the results.',
                'image'      => 'avatars/6.jpg',
                'company'    => 'Property Investor',
                'status'     => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 3,
                'name'       => 'Jessica White',
                'content'    => 'Selling my home with the help of this real estate team was a breeze. They provided valuable advice, staged my property beautifully, and negotiated a great deal. I highly recommend their services to anyone looking to sell their home!',
                'image'      => 'avatars/5.jpg',
                'company'    => 'Delighted Home Seller',
                'status'     => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 4,
                'name'       => 'Daniel Miller',
                'content'    => 'Thanks to the expertise and guidance of this real estate team, I am now the proud owner of my dream home. They listened to my preferences, answered all my questions, and made the entire home buying process a positive experience.',
                'image'      => 'avatars/11.jpg',
                'company'    => 'Happy New Homeowner',
                'status'     => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
