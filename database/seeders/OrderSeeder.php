<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\DeliveryTracking;
use App\Models\Meal;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Rating;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $meals = Meal::all();

        if ($meals->isEmpty()) {
            $meals = Meal::factory()->count(8)->create();
        }

        Customer::all()->each(function (Customer $customer) use ($meals): void {
            $orders = Order::factory()
                ->count(2)
                ->create([
                    'customer_id' => $customer->id,
                    'locale' => $customer->preferred_locale,
                    'whatsapp_number' => $customer->whatsapp_number ?? $customer->phone,
                    'delivery_address' => $customer->address_line,
                    'delivery_city' => $customer->city,
                ]);

            $orders->each(function (Order $order) use ($meals, $customer): void {
                $itemsCount = random_int(1, 3);
                $total = 0;

                for ($i = 0; $i < $itemsCount; $i++) {
                    $meal = $meals->random();
                    $quantity = random_int(1, 3);
                    $total += $quantity * (float) $meal->price;

                    OrderItem::factory()->create([
                        'order_id' => $order->id,
                        'meal_id' => $meal->id,
                        'quantity' => $quantity,
                        'unit_price' => $meal->price,
                        'total' => $quantity * (float) $meal->price,
                    ]);
                }

                $order->update(['total' => $total]);

                Payment::factory()->create([
                    'order_id' => $order->id,
                    'amount' => $total,
                    'currency' => $order->currency,
                    'status' => fake()->randomElement(['paid', 'pending', 'failed']),
                ]);

                DeliveryTracking::factory()->create([
                    'order_id' => $order->id,
                    'status' => $order->status,
                ]);

                if (fake()->boolean(40)) {
                    Rating::factory()->create([
                        'order_id' => $order->id,
                        'customer_id' => $customer->id,
                        'locale' => $order->locale,
                    ]);
                }
            });
        });
    }
}
