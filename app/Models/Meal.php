<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'category_en',
        'category_ar',
        'price',
        'image_url',
        'is_active',
    ];

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getName(string $locale = 'en'): string
    {
        return $locale === 'ar' ? $this->name_ar : $this->name_en;
    }

    public function getDescription(string $locale = 'en'): ?string
    {
        return $locale === 'ar' ? $this->description_ar : $this->description_en;
    }
}
