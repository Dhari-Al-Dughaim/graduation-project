<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    public function definition(): array
    {
        $locale = fake()->randomElement(['en', 'ar']);

        return [
            'user_id' => User::factory()->state(['is_admin' => false, 'preferred_locale' => $locale]),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'whatsapp_number' => fake()->e164PhoneNumber(),
            'preferred_locale' => $locale,
            'address_line' => fake()->streetAddress(),
            'city' => fake()->city(),
            'notes' => fake()->boolean(40) ? fake()->sentence() : null,
        ];
    }
}
