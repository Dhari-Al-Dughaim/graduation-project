<?php

namespace Database\Factories;

use App\Models\Meal;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 4);
        $unitPrice = fake()->randomFloat(2, 5, 35);

        return [
            'order_id' => Order::factory(),
            'meal_id' => Meal::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => $quantity * $unitPrice,
        ];
    }
}
