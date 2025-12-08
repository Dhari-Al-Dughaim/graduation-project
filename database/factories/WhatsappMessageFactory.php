<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\WhatsappMessage>
 */
class WhatsappMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'direction' => fake()->randomElement(['inbound', 'outbound']),
            'type' => fake()->randomElement(['invoice', 'status', 'eta', 'rating']),
            'recipient' => fake()->e164PhoneNumber(),
            'body' => fake()->sentence(8),
            'payload' => ['message_id' => Str::uuid()->toString()],
        ];
    }
}
