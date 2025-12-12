<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Jobs\SendOrderStatusWhatsAppNotification;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with(['customer', 'payment'])
            ->latest()
            ->paginate(15)
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => [
                        'name' => $order->customer->name,
                        'locale' => $order->customer->preferred_locale,
                    ],
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total' => $order->total,
                    'created_at' => $order->created_at,
                ];
            });

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['customer', 'items.meal', 'payment', 'deliveryTracking', 'rating']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    public function invoice(Order $order): Response
    {
        $order->load(['customer', 'items.meal', 'payment']);

        return Inertia::render('admin/orders/invoice', [
            'order' => $order,
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        $data = $request->validated();
        $oldStatus = $order->status;
        $newStatus = $data['status'];

        $order->update([
            'status' => $newStatus,
            'payment_status' => $data['payment_status'] ?? $order->payment_status,
            'delivery_eta_minutes' => $data['delivery_eta_minutes'] ?? $order->delivery_eta_minutes,
        ]);

        if ($order->deliveryTracking) {
            $order->deliveryTracking->update([
                'status' => $order->status,
            ]);
        }

        // Send WhatsApp notification if status changed
        if ($oldStatus !== $newStatus) {
            SendOrderStatusWhatsAppNotification::dispatch($order, $newStatus, $oldStatus);
        }

        return back();
    }
}
