<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_accounts')->truncate();

        $accounts = [
            ['id' => 1,  'first_name' => 'Sarah',    'last_name' => 'Johnson',   'email' => 'sarah.johnson@homzen.ma',   'username' => 'sarahjohnson',   'phone' => '+212 612 345 001', 'city_id' => 6],
            ['id' => 2,  'first_name' => 'Michael',  'last_name' => 'Chen',      'email' => 'michael.chen@homzen.ma',    'username' => 'michaelchen',    'phone' => '+212 612 345 002', 'city_id' => 4],
            ['id' => 3,  'first_name' => 'Emma',     'last_name' => 'Williams',  'email' => 'emma.williams@homzen.ma',   'username' => 'emmawilliams',   'phone' => '+212 612 345 003', 'city_id' => 1],
            ['id' => 4,  'first_name' => 'James',    'last_name' => 'Brown',     'email' => 'james.brown@homzen.ma',     'username' => 'jamesbrown',     'phone' => '+212 612 345 004', 'city_id' => 8],
            ['id' => 5,  'first_name' => 'Olivia',   'last_name' => 'Taylor',    'email' => 'olivia.taylor@homzen.ma',   'username' => 'oliviataylor',   'phone' => '+212 612 345 005', 'city_id' => 12],
            ['id' => 6,  'first_name' => 'William',  'last_name' => 'Martinez',  'email' => 'william.martinez@homzen.ma','username' => 'williammartinez','phone' => '+212 612 345 006', 'city_id' => 22],
            ['id' => 7,  'first_name' => 'Sophia',   'last_name' => 'Anderson',  'email' => 'sophia.anderson@homzen.ma', 'username' => 'sophiaanderson', 'phone' => '+212 612 345 007', 'city_id' => 14],
            ['id' => 8,  'first_name' => 'Liam',     'last_name' => 'Garcia',    'email' => 'liam.garcia@homzen.ma',     'username' => 'liamgarcia',     'phone' => '+212 612 345 008', 'city_id' => 16],
            ['id' => 9,  'first_name' => 'Ava',      'last_name' => 'Rodriguez', 'email' => 'ava.rodriguez@homzen.ma',   'username' => 'avarodriguez',   'phone' => '+212 612 345 009', 'city_id' => 19],
            ['id' => 10, 'first_name' => 'Noah',     'last_name' => 'Wilson',    'email' => 'noah.wilson@homzen.ma',     'username' => 'noahwilson',     'phone' => '+212 612 345 010', 'city_id' => 10],
            ['id' => 11, 'first_name' => 'Isabella', 'last_name' => 'Lee',       'email' => 'isabella.lee@homzen.ma',    'username' => 'isabellalee',    'phone' => '+212 612 345 011', 'city_id' => 3],
            ['id' => 12, 'first_name' => 'Oliver',   'last_name' => 'Nguyen',    'email' => 'oliver.nguyen@homzen.ma',   'username' => 'olivernguyen',   'phone' => '+212 612 345 012', 'city_id' => 6],
        ];

        foreach ($accounts as $acc) {
            DB::table('re_accounts')->insert([
                'id'          => $acc['id'],
                'first_name'  => $acc['first_name'],
                'last_name'   => $acc['last_name'],
                'email'       => $acc['email'],
                'username'    => $acc['username'],
                'password'    => Hash::make('password'),
                'phone'       => $acc['phone'],
                'city_id'     => $acc['city_id'],
                'is_featured' => $acc['id'] <= 4 ? 1 : 0,
                'is_verified' => 1,
                'verified_at' => now(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}
