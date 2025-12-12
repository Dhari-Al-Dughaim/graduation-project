<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\WhatsappService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWelcomeWhatsapp
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $phone
    ) {}

    public function handle(WhatsappService $whatsappService): void
    {
        if (!$this->phone) {
            return;
        }

        $storeUrl = url('/');

        $message = "👋 Welcome to our store, *{$this->user->name}*!\n\n"
            . "🎊 Thank you for registering! We're thrilled to have you with us.\n\n"
            . "🍽️ Explore our delicious menu and find your favorites:\n{$storeUrl}\n\n"
            . "💚 We can't wait to serve you your first meal!\n\n"
            . "If you have any questions, feel free to reach out. We're here to help! 🙋‍♂️";

        $whatsappService->send($this->phone, $message);
    }
}
