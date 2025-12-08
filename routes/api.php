<?php

use App\Http\Controllers\Webhook\WhatsappWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/whatsapp/webhook', WhatsappWebhookController::class)
    ->name('api.whatsapp.webhook');
