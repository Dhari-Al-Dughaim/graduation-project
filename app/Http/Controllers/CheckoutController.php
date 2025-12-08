<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Customer;
use App\Models\Meal;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(): Response
    {
        $locale = app()->getLocale();
        $meals = Meal::where('is_active', true)
            ->orderBy('name_en')
            ->get()
            ->map(fn (Meal $meal) => [
                'id' => $meal->id,
                'name' => $meal->getName($locale),
                'price' => (float) $meal->price,
                'image_url' => $meal->image_url,
            ]);

        return Inertia::render('store/checkout', [
            'meals' => $meals,
        ]);
    }

    public function store(CheckoutRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $locale = $data['customer']['locale'] ?? app()->getLocale();

        $customer = Customer::firstOrCreate(
            [
                'email' => $data['customer']['email'] ?? null,
                'phone' => $data['customer']['phone'],
            ],
            [
                'name' => $data['customer']['name'],
                'preferred_locale' => $locale,
                'whatsapp_number' => $data['customer']['whatsapp_number'] ?? $data['customer']['phone'],
                'address_line' => $data['delivery_address'] ?? null,
                'city' => $data['delivery_city'] ?? null,
                'notes' => $data['delivery_notes'] ?? null,
            ]
        );

        $order = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'currency' => 'KWD',
            'locale' => $locale,
            'whatsapp_number' => $customer->whatsapp_number,
            'delivery_address' => $data['delivery_address'] ?? $customer->address_line,
            'delivery_city' => $data['delivery_city'] ?? $customer->city,
            'delivery_notes' => $data['delivery_notes'] ?? null,
            'tracking_code' => 'TRK-' . strtoupper(Str::random(10)),
        ]);

        $total = 0;

        foreach ($data['items'] as $itemData) {
            /** @var Meal $meal */
            $meal = Meal::findOrFail($itemData['meal_id']);
            $quantity = (int) $itemData['quantity'];
            $lineTotal = $quantity * (float) $meal->price;
            $total += $lineTotal;

            OrderItem::create([
                'order_id' => $order->id,
                'meal_id' => $meal->id,
                'quantity' => $quantity,
                'unit_price' => $meal->price,
                'total' => $lineTotal,
            ]);
        }

        $order->update(['total' => $total]);

        Payment::create([
            'order_id' => $order->id,
            'provider' => 'upayment',
            'status' => 'pending',
            'amount' => $total,
            'currency' => 'KWD',
            'reference' => 'PAY-' . strtoupper(Str::random(10)),
        ]);

        return redirect()->route('orders.payment', $order);
    }
}
