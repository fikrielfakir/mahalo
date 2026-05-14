<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::truncate();

        User::create([
            'name'              => 'Admin',
            'email'             => 'admin@homzen.ma',
            'password'          => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
    }
}
