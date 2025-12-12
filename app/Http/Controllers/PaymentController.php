<?php

namespace App\Http\Controllers;

use App\Jobs\SendOrderConfirmationWhatsapp;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function show(Order $order): Response
    {
        $order->load(['items.meal', 'payment']);

        return Inertia::render('store/payment', [
            'order' => $order,
        ]);
    }

    public function store(Request $request, Order $order): RedirectResponse
    {
        $status = $request->string('status')->lower()->value() === 'success' ? 'paid' : 'failed';

        $order->payment?->update(['status' => $status]);
        $order->update([
            'payment_status' => $status,
            'status' => $status === 'paid' ? 'confirmed' : 'pending',
        ]);

        if ($status === 'paid') {
            // Load customer relationship for WhatsApp notification
            $order->load('customer');
            SendOrderConfirmationWhatsapp::dispatchSync($order);

            return redirect()->route('orders.success', $order);
        }

        return redirect()->route('orders.failure', $order);
    }

    public function success(Order $order): Response
    {
        return Inertia::render('store/order-success', [
            'order' => $order->load('payment'),
        ]);
    }

    public function failure(Order $order): Response
    {
        return Inertia::render('store/order-failure', [
            'order' => $order->load('payment'),
        ]);
    }
}
