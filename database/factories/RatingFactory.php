<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Rating>
 */
class RatingFactory extends Factory
{
    public function definition(): array
    {
        $locale = fake()->randomElement(['en', 'ar']);

        return [
            'order_id' => Order::factory(),
            'customer_id' => Customer::factory(),
            'score' => fake()->numberBetween(3, 5),
            'comment' => fake()->boolean(60) ? fake()->sentence(10) : null,
            'locale' => $locale,
        ];
    }
}
