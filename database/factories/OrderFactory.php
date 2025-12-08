<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $locale = fake()->randomElement(['en', 'ar']);

        return [
            'customer_id' => Customer::factory(),
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => fake()->randomElement(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']),
            'payment_status' => fake()->randomElement(['unpaid', 'pending', 'paid', 'failed']),
            'total' => fake()->randomFloat(2, 15, 120),
            'currency' => 'KWD',
            'locale' => $locale,
            'whatsapp_number' => fake()->e164PhoneNumber(),
            'delivery_address' => fake()->streetAddress(),
            'delivery_city' => fake()->city(),
            'delivery_notes' => fake()->boolean(40) ? fake()->sentence(8) : null,
            'tracking_code' => 'TRK-' . strtoupper(Str::random(10)),
            'delivery_eta_minutes' => fake()->numberBetween(20, 90),
        ];
    }
}
