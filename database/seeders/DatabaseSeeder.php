<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = \App\Models\User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'preferred_locale' => 'en',
        ]);

        \App\Models\Customer::factory()->create([
            'user_id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'preferred_locale' => $admin->preferred_locale,
        ]);

        $this->call([
            CustomerSeeder::class,
            MealSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
