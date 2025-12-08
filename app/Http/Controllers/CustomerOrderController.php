<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customer = $user?->customer;

        $orders = Order::query()
            ->when($customer, fn ($query) => $query->where('customer_id', $customer->id))
            ->with('payment')
            ->latest()
            ->paginate(10)
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total' => $order->total,
                    'currency' => $order->currency,
                    'created_at' => $order->created_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('store/my-orders', [
            'orders' => $orders,
        ]);
    }
}

