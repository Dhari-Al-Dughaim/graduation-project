<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'provider' => 'upayment',
            'status' => fake()->randomElement(['pending', 'paid', 'failed']),
            'amount' => fake()->randomFloat(2, 15, 120),
            'currency' => 'KWD',
            'reference' => strtoupper(Str::random(12)),
            'meta' => ['transaction_id' => Str::uuid()->toString()],
        ];
    }
}
