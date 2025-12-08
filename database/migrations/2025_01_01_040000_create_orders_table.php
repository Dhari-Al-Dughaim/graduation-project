<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('order_number')->unique();
            $table->string('status')->default('pending');
            $table->string('payment_status')->default('unpaid');
            $table->decimal('total', 10, 2)->default(0);
            $table->string('currency', 3)->default('KWD');
            $table->string('locale', 5)->default('en');
            $table->string('whatsapp_number')->nullable();
            $table->string('delivery_address')->nullable();
            $table->string('delivery_city')->nullable();
            $table->string('delivery_notes')->nullable();
            $table->string('tracking_code')->unique();
            $table->unsignedInteger('delivery_eta_minutes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
