<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Samnad S',
            'email' => 'samnads2014@gmail.com',
            'password' => 12345
        ]);
        
        DB::table('products')->insert([
            'name' => 'Apple MacBook',
            'price' => 90000,
            'description' => 'MacBook Pro features the most advanced line-up of chips ever built for a pro laptop.',
        ]);
        DB::table('products')->insert([
            'name' => 'Lenovo Thinkpad',
            'price' => 45500,
            'description' => 'These advanced series laptops feature a number of drool-worthy features...',
        ]);
        DB::table('products')->insert([
            'name' => 'Keyboard & Mouse Combo',
            'price' => 3450,
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        ]);
        DB::table('products')->insert([
            'name' => 'Intel Core i7 7700K',
            'price' => 25000,
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        ]);
        DB::table('products')->insert([
            'name' => 'Intel Core i9 12th Gen',
            'price' => 90500,
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        ]);
        DB::table('products')->insert([
            'name' => 'OnePlus 9 Series',
            'price' => 65000,
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        ]);
    }
}
