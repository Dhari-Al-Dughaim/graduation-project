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
        Schema::create('whatsapp_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('direction')->default('outbound');
            $table->string('type')->nullable();
            $table->string('recipient');
            $table->text('body');
            $table->json('payload')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_messages');
    }
};
