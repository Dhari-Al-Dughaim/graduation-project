<?php

namespace Usama\Upayment\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UPaymentController extends Controller
{
    use UpaymentTrait;

    /**
     * API endpoint to create payment URL
     */
    public function makePaymentApi(Request $request)
    {
        $validate = validator($request->all(), [
            'order_id' => 'required|numeric|exists:orders,id',
        ]);

        if ($validate->fails()) {
            return response()->json(['message' => $validate->errors()->first()], 400);
        }

        $order = Order::with(['customer', 'items.meal'])->find($request->order_id);

        if ($order) {
            $paymentUrl = $this->processPayment($order);
            if ($paymentUrl) {
                return response()->json(['paymentUrl' => $paymentUrl], 200);
            }
        }

        return response()->json(['message' => 'No payment URL created'], 400);
    }

    /**
     * Web endpoint to create payment and redirect to UPayment
     */
    public function makePayment(Request $request)
    {
        $validate = validator($request->all(), [
            'order_id' => 'required|numeric|exists:orders,id',
        ]);

        if ($validate->fails()) {
            return redirect()->back()->with('errors', $validate->errors());
        }

        $order = Order::with(['customer', 'items.meal'])->find($request->order_id);

        if (!$order) {
            abort(404, 'Order not found');
        }

        try {
            $paymentUrl = $this->processPayment($order);
            if ($paymentUrl) {
                return redirect()->to($paymentUrl);
            }
        } catch (\Exception $e) {
            return redirect()->route('orders.failure', $order)->with('error', $e->getMessage());
        }

        abort(404, 'Payment URL creation failed');
    }

    /**
     * Success callback from UPayment
     */
    public function result(Request $request)
    {
        try {
            $validate = validator($request->all(), [
                'requested_order_id' => 'required',
            ]);

            if ($validate->fails()) {
                throw new \Exception($validate->errors()->first());
            }

            $order = Order::with(['customer', 'items.meal', 'payment'])->find($request->requested_order_id);

            if (!$order) {
                throw new \Exception('Order not found');
            }

            // Update order status
            $order->update([
                'status' => 'confirmed',
                'payment_status' => 'paid',
            ]);

            // Update payment record
            if ($order->payment) {
                $order->payment->update([
                    'status' => 'paid',
                    'reference' => $request->track_id ?? $request->order_id ?? null,
                    'meta' => [
                        'upayment_order_id' => $request->order_id ?? null,
                        'track_id' => $request->track_id ?? null,
                        'transaction_date' => $request->transaction_date ?? now()->toDateTimeString(),
                        'payment_type' => $request->payment_type ?? null,
                        'result' => $request->result ?? 'CAPTURED',
                    ],
                ]);
            }

            return Inertia::render('store/order-success', [
                'order' => $order->load(['customer', 'items.meal', 'payment']),
            ]);
        } catch (\Exception $e) {
            abort(404, $e->getMessage());
        }
    }

    /**
     * Error/Cancel callback from UPayment
     */
    public function error(Request $request)
    {
        try {
            $validate = validator($request->all(), [
                'requested_order_id' => 'required',
            ]);

            if ($validate->fails()) {
                // Try to get order from order_id if requested_order_id is missing
                $orderId = $request->requested_order_id ?? $request->order_id ?? null;
                if (!$orderId) {
                    abort(404, 'Order ID not provided');
                }
                $request->merge(['requested_order_id' => $orderId]);
            }

            $order = Order::with(['customer', 'items.meal', 'payment'])->find($request->requested_order_id);

            if (!$order) {
                abort(404, 'Order not found');
            }

            // Update order status
            $order->update([
                'status' => 'pending',
                'payment_status' => 'failed',
            ]);

            // Update payment record
            if ($order->payment) {
                $order->payment->update([
                    'status' => 'failed',
                    'reference' => $request->track_id ?? null,
                    'meta' => [
                        'upayment_order_id' => $request->order_id ?? null,
                        'track_id' => $request->track_id ?? null,
                        'result' => $request->result ?? 'FAILED',
                        'error_message' => $this->getErrorMessage($request->result),
                    ],
                ]);
            }

            return Inertia::render('store/order-failure', [
                'order' => $order->load(['customer', 'items.meal', 'payment']),
                'errorMessage' => $this->getErrorMessage($request->result),
            ]);
        } catch (\Exception $e) {
            abort(404, $e->getMessage());
        }
    }

    /**
     * Get human-readable error message based on payment result
     */
    protected function getErrorMessage(?string $result): string
    {
        if (!$result) {
            return 'Payment failed. Please try again.';
        }

        return match (strtoupper($result)) {
            'NOT CAPTURED' => 'Payment was not captured. Please try again.',
            'CANCELLED' => 'Payment was cancelled.',
            'DECLINED' => 'Payment was declined. Please check your card details.',
            'EXPIRED' => 'Payment session expired. Please try again.',
            default => 'Payment failed. Please try again.',
        };
    }
}
