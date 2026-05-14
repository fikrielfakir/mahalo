<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConsultSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_consults')->truncate();

        DB::table('re_consults')->insert([
            [
                'name'        => 'Ahmed Benali',
                'email'       => 'ahmed.benali@gmail.com',
                'phone'       => '+212 661 234 567',
                'property_id' => 1,
                'project_id'  => null,
                'content'     => 'I am interested in visiting this property. When is it available?',
                'status'      => 'read',
                'created_at'  => now()->subDays(5),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Fatima Zahra',
                'email'       => 'fatima.zahra@outlook.com',
                'phone'       => '+212 662 345 678',
                'property_id' => null,
                'project_id'  => 1,
                'content'     => 'Please send me the full brochure and pricing details for this project.',
                'status'      => 'unread',
                'created_at'  => now()->subDays(2),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Karim Idrissi',
                'email'       => 'karim.idrissi@hotmail.com',
                'phone'       => '+212 663 456 789',
                'property_id' => 3,
                'project_id'  => null,
                'content'     => 'Is negotiation possible on the price? I am a cash buyer.',
                'status'      => 'unread',
                'created_at'  => now()->subDay(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
