<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderTrackingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('store/track-order-lookup');
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'order_number' => 'required|string',
        ]);

        $searchTerm = trim($request->order_number);

        // Search by exact order_number, with ORD- prefix, or by tracking_code
        $order = Order::where(function ($query) use ($searchTerm) {
            $query->whereRaw('LOWER(order_number) = ?', [strtolower($searchTerm)])
                  ->orWhereRaw('LOWER(order_number) = ?', [strtolower('ORD-' . $searchTerm)])
                  ->orWhereRaw('LOWER(tracking_code) = ?', [strtolower($searchTerm)])
                  ->orWhereRaw('LOWER(tracking_code) = ?', [strtolower('TRK-' . $searchTerm)]);
        })
            ->with(['deliveryTracking', 'items.meal', 'customer', 'payment'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found. Please check your order number and try again.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $order->load(['deliveryTracking', 'items.meal', 'customer', 'payment', 'rating']);

        return Inertia::render('store/track-order', [
            'order' => $order,
        ]);
    }

    public function showByCode(Request $request, Order $order): Response
    {
        return $this->show($request, $order);
    }

    public function invoice(Order $order): Response
    {
        $order->load(['customer', 'items.meal', 'payment']);

        return Inertia::render('store/order-invoice', [
            'order' => $order,
        ]);
    }

    public function details(Order $order): Response
    {
        $order->load(['customer', 'items.meal', 'payment', 'deliveryTracking', 'rating']);

        return Inertia::render('store/order-details', [
            'order' => $order,
        ]);
    }
}
