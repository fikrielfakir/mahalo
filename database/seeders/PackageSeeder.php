<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('re_packages')->truncate();

        DB::table('re_packages')->insert([
            [
                'id' => 1, 'name' => 'Free Trial', 'price' => 0, 'currency_id' => 1,
                'percent_save' => 0, 'number_of_listings' => 1, 'account_limit' => 1,
                'order' => 1, 'is_default' => 0, 'status' => 'published',
                'description' => null,
                'features' => '[[{"key":"text","value":"Limited time trial period"}],[{"key":"text","value":"1 listing allowed"}],[{"key":"text","value":"Basic support"}]]',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 2, 'name' => 'Basic Listing', 'price' => 250, 'currency_id' => 1,
                'percent_save' => 0, 'number_of_listings' => 1, 'account_limit' => 5,
                'order' => 2, 'is_default' => 1, 'status' => 'published',
                'description' => null,
                'features' => '[[{"key":"text","value":"1 listing allowed"}],[{"key":"text","value":"5 photos per listing"}],[{"key":"text","value":"Basic support"}]]',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 3, 'name' => 'Standard Package', 'price' => 1000, 'currency_id' => 1,
                'percent_save' => 20, 'number_of_listings' => 5, 'account_limit' => 10,
                'order' => 3, 'is_default' => 0, 'status' => 'published',
                'description' => null,
                'features' => '[[{"key":"text","value":"5 listings allowed"}],[{"key":"text","value":"10 photos per listing"}],[{"key":"text","value":"Priority support"}]]',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 4, 'name' => 'Professional Package', 'price' => 1800, 'currency_id' => 1,
                'percent_save' => 28, 'number_of_listings' => 10, 'account_limit' => 15,
                'order' => 4, 'is_default' => 0, 'status' => 'published',
                'description' => null,
                'features' => '[[{"key":"text","value":"10 listings allowed"}],[{"key":"text","value":"15 photos per listing"}],[{"key":"text","value":"Premium support"}],[{"key":"text","value":"Featured listings"}]]',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id' => 5, 'name' => 'Premium Package', 'price' => 2500, 'currency_id' => 1,
                'percent_save' => 33, 'number_of_listings' => 15, 'account_limit' => 20,
                'order' => 5, 'is_default' => 0, 'status' => 'published',
                'description' => null,
                'features' => '[[{"key":"text","value":"15 listings allowed"}],[{"key":"text","value":"20 photos per listing"}],[{"key":"text","value":"Premium support"}],[{"key":"text","value":"Featured listings"}],[{"key":"text","value":"Priority listing placement"}]]',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);
    }
}
