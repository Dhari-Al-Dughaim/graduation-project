<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'order_number',
        'status',
        'payment_status',
        'total',
        'currency',
        'locale',
        'whatsapp_number',
        'delivery_address',
        'delivery_city',
        'delivery_notes',
        'tracking_code',
        'delivery_eta_minutes',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function rating(): HasOne
    {
        return $this->hasOne(Rating::class);
    }

    public function deliveryTracking(): HasOne
    {
        return $this->hasOne(DeliveryTracking::class);
    }

    public function whatsappMessages(): HasMany
    {
        return $this->hasMany(WhatsappMessage::class);
    }
}
