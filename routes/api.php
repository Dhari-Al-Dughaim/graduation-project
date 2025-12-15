<?php

use App\Http\Controllers\Webhook\WhatsappWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/assistant/chat', \App\Http\Controllers\Api\ChatAssistantController::class)
    ->name('api.assistant.chat');

Route::post('/whatsapp/webhook', WhatsappWebhookController::class)
    ->name('api.whatsapp.webhook');
