<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\WhatsappService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderConfirmationWhatsapp
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    public function handle(WhatsappService $whatsappService): void
    {
        // Ensure customer relationship is loaded
        $this->order->loadMissing('customer');

        $phone = $this->order->whatsapp_number
            ?? $this->order->customer?->whatsapp_number
            ?? $this->order->customer?->phone;

        if (!$phone) {
            return;
        }

        $customerName = $this->order->customer?->name ?? 'Valued Customer';
        $orderNumber = $this->order->order_number;
        $total = number_format($this->order->total, 3) . ' ' . $this->order->currency;
        $trackingUrl = url("/orders/code/{$orderNumber}/track");

        $message = "🎉 Hello {$customerName}!\n\n"
            . "Your order *#{$orderNumber}* has been *confirmed* and *paid successfully*! ✅\n\n"
            . "💰 *Total:* {$total}\n\n"
            . "📍 Track your order here:\n{$trackingUrl}\n\n"
            . "Thank you for your purchase! We're preparing your order with care. 💚";

        $whatsappService->send($phone, $message);
    }
}
