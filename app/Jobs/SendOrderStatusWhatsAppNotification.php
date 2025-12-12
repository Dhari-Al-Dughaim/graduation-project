<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\WhatsappService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderStatusWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $newStatus,
        public ?string $oldStatus = null
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

        $message = $this->buildStatusMessage();

        if ($message) {
            $whatsappService->send($phone, $message);
        }
    }

    protected function buildStatusMessage(): ?string
    {
        $customerName = $this->order->customer?->name ?? 'Valued Customer';
        $orderNumber = $this->order->order_number;
        $trackingUrl = $this->getOrderTrackingUrl();

        return match ($this->newStatus) {
            'pending' => $this->buildPendingMessage($customerName, $orderNumber, $trackingUrl),
            'confirmed' => $this->buildConfirmedMessage($customerName, $orderNumber, $trackingUrl),
            'preparing' => $this->buildPreparingMessage($customerName, $orderNumber, $trackingUrl),
            'ready' => $this->buildReadyMessage($customerName, $orderNumber, $trackingUrl),
            'out_for_delivery' => $this->buildOutForDeliveryMessage($customerName, $orderNumber, $trackingUrl),
            'delivered' => $this->buildDeliveredMessage($customerName, $orderNumber, $trackingUrl),
            'cancelled' => $this->buildCancelledMessage($customerName, $orderNumber),
            default => null,
        };
    }

    protected function getOrderTrackingUrl(): string
    {
        return url("/orders/code/{$this->order->order_number}/track");
    }

    protected function buildPendingMessage(string $customerName, string $orderNumber, string $trackingUrl): string
    {
        return "🕐 Hello {$customerName}!\n\n"
            . "Your order *#{$orderNumber}* is pending and awaiting confirmation.\n\n"
            . "We'll notify you as soon as it's confirmed! 📋\n\n"
            . "📍 Track your order here:\n{$trackingUrl}\n\n"
            . "Thank you for your patience! 🙏";
    }

    protected function buildConfirmedMessage(string $customerName, string $orderNumber, string $trackingUrl): string
    {
        return "✅ Great news, {$customerName}!\n\n"
            . "Your order *#{$orderNumber}* has been *confirmed*! 🎉\n\n"
            . "Our team will start preparing it shortly.\n\n"
            . "📍 Track your order here:\n{$trackingUrl}\n\n"
            . "Thank you for choosing us! 💚";
    }

    protected function buildPreparingMessage(string $customerName, string $orderNumber, string $trackingUrl): string
    {
        return "👨‍🍳 Hello {$customerName}!\n\n"
            . "Your order *#{$orderNumber}* is now being *prepared*! 🍳\n\n"
            . "Our chefs are working on your delicious meal with love and care.\n\n"
            . "📍 Track your order here:\n{$trackingUrl}\n\n"
            . "It won't be long now! ⏰";
    }

    protected function buildReadyMessage(string $customerName, string $orderNumber, string $trackingUrl): string
    {
        return "🎊 Exciting news, {$customerName}!\n\n"
            . "Your order *#{$orderNumber}* is *ready*! 📦\n\n"
            . "It's packed and waiting to be picked up for delivery.\n\n"
            . "📍 Track your order here:\n{$trackingUrl}\n\n"
            . "Almost there! 🚀";
    }

    protected function buildOutForDeliveryMessage(string $customerName, string $orderNumber, string $trackingUrl): string
    {
        $eta = $this->order->delivery_eta_minutes;
        $etaText = $eta ? "Estimated arrival: *{$eta} minutes* ⏱️" : "Your order will arrive soon!";

        return "🚗 {$customerName}, your order is on the way!\n\n"
            . "Order *#{$orderNumber}* is now *out for delivery*! 🛵\n\n"
            . "{$etaText}\n\n"
            . "📍 Track your order live here:\n{$trackingUrl}\n\n"
            . "Get ready to enjoy your meal! 🍽️";
    }

    protected function buildDeliveredMessage(string $customerName, string $orderNumber, string $trackingUrl): string
    {
        return "🎉 Congratulations, {$customerName}!\n\n"
            . "Your order *#{$orderNumber}* has been *delivered*! ✅\n\n"
            . "We hope you enjoy your meal! 😋\n\n"
            . "📍 View your order details here:\n{$trackingUrl}\n\n"
            . "Thank you for ordering with us! We'd love to hear your feedback. ⭐\n\n"
            . "See you again soon! 💚";
    }

    protected function buildCancelledMessage(string $customerName, string $orderNumber): string
    {
        return "😔 Hello {$customerName},\n\n"
            . "We're sorry to inform you that your order *#{$orderNumber}* has been *cancelled*.\n\n"
            . "If this was a mistake or you have any questions, please contact us and we'll be happy to help! 📞\n\n"
            . "We hope to serve you again soon! 🙏";
    }
}
