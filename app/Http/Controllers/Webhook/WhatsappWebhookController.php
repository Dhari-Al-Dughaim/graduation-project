<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Http\Requests\WhatsappWebhookRequest;
use App\Models\Order;
use App\Models\WhatsappMessage;
use Illuminate\Http\JsonResponse;

class WhatsappWebhookController extends Controller
{
    public function __invoke(WhatsappWebhookRequest $request): JsonResponse
    {
        $data = $request->validated();

        $order = null;
        if (! empty($data['order_number'])) {
            $order = Order::where('order_number', $data['order_number'])->first();
        }

        $message = WhatsappMessage::create([
            'order_id' => $order?->id,
            'direction' => 'inbound',
            'type' => $data['type'] ?? 'incoming',
            'recipient' => $data['recipient'],
            'body' => $data['body'],
            'payload' => $data['payload'] ?? null,
        ]);

        return response()->json([
            'status' => 'ok',
            'message_id' => $message->id,
        ]);
    }
}
