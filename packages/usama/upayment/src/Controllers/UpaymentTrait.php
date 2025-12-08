<?php

namespace Usama\Upayment\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait UpaymentTrait
{
    /**
     * Process payment and get payment URL from UPayment
     */
    public function processPayment(Order $order)
    {
        try {
            // Load order with customer and items
            $order->load(['customer', 'items.meal']);

            // Create payment data structure
            $paymentData = $this->createPaymentUrl($order);

            // Log the request for debugging
            Log::info('UPayment Request', [
                'url' => env('UPAYMENT_API_URL') . 'charge',
                'data' => $paymentData
            ]);

            // Make HTTP request with Bearer token authentication
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('UPAYMENT_API_KEY'),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post(
                env('UPAYMENT_API_URL') . 'charge',
                $paymentData
            );

            // Log the response for debugging
            Log::info('UPayment Response', [
                'status_code' => $response->status(),
                'response' => $response->json()
            ]);

            $result = $response->json();

            // Check if payment URL was created successfully
            if (isset($result['status']) && $result['status'] && isset($result['data']['link'])) {
                // Update payment with track ID if provided
                if (isset($result['data']['trackId']) && $order->payment) {
                    $order->payment->update([
                        'reference' => $result['data']['trackId'],
                        'meta' => array_merge($order->payment->meta ?? [], [
                            'track_id' => $result['data']['trackId'],
                        ]),
                    ]);
                }

                return $result['data']['link'];
            } else {
                $errorMsg = $result['message'] ?? 'Unknown error occurred';
                throw new \Exception('UPayment: ' . $errorMsg);
            }
        } catch (\Exception $e) {
            Log::error('UPayment Error', [
                'message' => $e->getMessage(),
                'order_id' => $order->id ?? null
            ]);
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Create payment URL data for UPayment API
     */
    public function createPaymentUrl(Order $order)
    {
        try {
            $customer = $order->customer;
            $locale = $order->locale ?? app()->getLocale();

            // Build products array from order items
            $products = $this->buildProductsArray($order);

            // Prepare payment data structure for UPayment v1 API
            $paymentData = [
                'products' => $products,
                'order' => [
                    'id' => strval($order->id),
                    'reference' => $order->order_number,
                    'description' => $this->getOrderDescription($order),
                    'currency' => $order->currency ?? env('UPAYMENT_CURRENCY_CODE', 'KWD'),
                    'amount' => floatval(number_format($order->total, 3, '.', '')),
                ],
                'language' => $locale === 'ar' ? 'ar' : 'en',
                'reference' => [
                    'id' => strval($order->id),
                ],
                'customer' => [
                    'uniqueId' => strval($customer->id ?? $order->id),
                    'name' => $customer->name ?? 'Guest',
                    'email' => $customer->email ?? 'guest@example.com',
                    'mobile' => $customer->phone ?? $customer->whatsapp_number ?? '',
                ],
                'returnUrl' => $locale === 'ar'
                    ? env('AR_UPAYMENT_RETURN_URL', route('upayment.web.payment.result'))
                    : env('EN_UPAYMENT_RETURN_URL', route('upayment.web.payment.result')),
                'cancelUrl' => $locale === 'ar'
                    ? env('AR_UPAYMENT_ERROR_URL', route('upayment.web.payment.error'))
                    : env('EN_UPAYMENT_ERROR_URL', route('upayment.web.payment.error')),
                'notificationUrl' => env('UPAYMENT_NOTIFICATION_URL', ''),
                'paymentGateway' => [
                    'src' => env('UPAYMENT_GATEWAY', 'knet'),
                ],
            ];

            return $paymentData;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Build products array from order items (meals)
     */
    protected function buildProductsArray(Order $order)
    {
        $products = [];
        $locale = $order->locale ?? app()->getLocale();

        foreach ($order->items as $item) {
            $meal = $item->meal;
            if ($meal) {
                $mealName = $locale === 'ar' ? $meal->name_ar : $meal->name_en;
                $products[] = [
                    'name' => $mealName ?? 'Meal Item',
                    'description' => $mealName . ' x ' . $item->quantity,
                    'price' => floatval(number_format($item->unit_price, 3, '.', '')),
                    'quantity' => (int) $item->quantity,
                ];
            }
        }

        // If no products were added, add a single product with the total amount
        if (empty($products)) {
            $products[] = [
                'name' => 'Order #' . $order->order_number,
                'description' => 'Burger Restaurant Order',
                'price' => floatval(number_format($order->total, 3, '.', '')),
                'quantity' => 1,
            ];
        }

        return $products;
    }

    /**
     * Get order description for payment
     */
    protected function getOrderDescription(Order $order)
    {
        $locale = $order->locale ?? app()->getLocale();
        $itemCount = $order->items->count();

        if ($itemCount === 0) {
            return 'Order #' . $order->order_number;
        }

        $itemNames = $order->items->map(function ($item) use ($locale) {
            $meal = $item->meal;
            if ($meal) {
                $name = $locale === 'ar' ? $meal->name_ar : $meal->name_en;
                return $name . ' x' . $item->quantity;
            }
            return 'Item x' . $item->quantity;
        })->implode(', ');

        return 'Order #' . $order->order_number . ': ' . $itemNames;
    }

    /**
     * Clear cart session
     */
    public function clearCart()
    {
        session()->forget('cart');
    }
}
