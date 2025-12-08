<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderInvoiceController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with('customer')
            ->latest()
            ->paginate(20)
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => [
                        'name' => $order->customer?->name ?? 'Guest',
                    ],
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total' => $order->total,
                    'currency' => $order->currency,
                    'created_at' => $order->created_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('admin/invoices/index', [
            'orders' => $orders,
        ]);
    }
}

