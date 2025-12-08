<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\DeliveryTracking>
 */
class DeliveryTrackingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'status' => fake()->randomElement(['pending', 'preparing', 'out_for_delivery', 'delivered']),
            'location' => fake()->boolean(70) ? fake()->streetName() : null,
            'eta' => fake()->boolean(70) ? fake()->numberBetween(15, 90) . ' min' : null,
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }
}
