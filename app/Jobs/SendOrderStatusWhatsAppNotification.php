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
        $this->order->loadMissing('customer');

        $phone = $this->order->whatsapp_number
            ?? $this->order->customer?->whatsapp_number
            ?? $this->order->customer?->phone;

        if (!$phone) {
            return;
        }

        $trackingUrl = $this->getOrderTrackingUrl();
        $message = $this->buildStatusMessage($trackingUrl);

        if ($message) {
            $response = $whatsappService->send($phone, $message);

            $this->logMessage($phone, $message, $trackingUrl, $response);
        }
    }

    protected function buildStatusMessage(string $trackingUrl): ?string
    {
        $customerName = $this->order->customer?->name ?? 'there';
        $orderNumber = $this->order->order_number;
        $statusLabel = $this->formatStatus($this->newStatus);
        $oldStatusLabel = $this->oldStatus ? $this->formatStatus($this->oldStatus) : null;

        if (! $statusLabel) {
            return null;
        }

        $emoji = $this->statusEmoji()[$this->newStatus] ?? 'ℹ️';
        $total = number_format((float) $this->order->total, 2);
        $currency = $this->order->currency ?? 'KWD';
        $paymentStatus = $this->formatStatus($this->order->payment_status);

        $intro = "{$emoji} Hi {$customerName}! We have an update on your order *#{$orderNumber}*.";
        $statusLine = $oldStatusLabel
            ? "Status: *{$oldStatusLabel}* ➜ *{$statusLabel}*"
            : "Status: *{$statusLabel}*";

        $statusNotes = $this->statusNotes()[$this->newStatus] ?? null;
        $etaLine = $this->order->delivery_eta_minutes
            ? "⏱️ ETA: about {$this->order->delivery_eta_minutes} minutes."
            : null;

        $lines = array_values(array_filter([
            $intro,
            $statusLine,
            $statusNotes,
            "💰 Total: {$total} {$currency}",
            $paymentStatus ? "💳 Payment: *{$paymentStatus}*" : null,
            $etaLine,
            "📍 Track your order here:\n{$trackingUrl}",
            "Need help? Just reply to this message and we'll assist right away. 🤝",
        ]));

        return implode("\n\n", $lines);
    }

    protected function getOrderTrackingUrl(): string
    {
        return url("/orders/code/{$this->order->order_number}/track");
    }

    protected function formatStatus(?string $status): ?string
    {
        return $status
            ? ucwords(str_replace('_', ' ', $status))
            : null;
    }

    /**
     * @return array<string, string>
     */
    protected function statusEmoji(): array
    {
        return [
            'pending' => '🕐',
            'confirmed' => '✅',
            'preparing' => '👨‍🍳',
            'ready' => '📦',
            'out_for_delivery' => '🛵',
            'delivered' => '🎉',
            'cancelled' => '😔',
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function statusNotes(): array
    {
        return [
            'pending' => "We're reviewing your order and will confirm shortly. 📋",
            'confirmed' => 'Your order is locked in and moving to the kitchen. 🎉',
            'preparing' => 'Our chefs are crafting your meal with care. 🍳',
            'ready' => "It's packed and queued for the driver. 🚦",
            'out_for_delivery' => 'Your driver is en route. Keep an eye on live tracking! 🚗',
            'delivered' => 'Hope you enjoy your meal! Share your feedback anytime. ⭐',
            'cancelled' => 'If this was unexpected, reply here and we will help. 🙏',
        ];
    }

    /**
     * @param array<string, mixed>|null $response
     */
    protected function logMessage(string $phone, string $body, string $trackingUrl, ?array $response): void
    {
        $payload = [
            'order_status' => $this->newStatus,
            'old_status' => $this->oldStatus,
            'tracking_url' => $trackingUrl,
            'response' => $response,
        ];

        $this->order->whatsappMessages()->create([
            'direction' => 'outbound',
            'type' => 'status_update',
            'recipient' => $phone,
            'body' => $body,
            'payload' => $payload,
        ]);
    }
}
