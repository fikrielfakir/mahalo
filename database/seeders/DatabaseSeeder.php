<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            CurrencySeeder::class,
            CategorySeeder::class,
            FeatureSeeder::class,
            FacilitySeeder::class,
            InvestorSeeder::class,
            PackageSeeder::class,
            UserSeeder::class,
            AccountSeeder::class,
            ProjectSeeder::class,
            PropertySeeder::class,
            TestimonialSeeder::class,
        ]);
    }
}
