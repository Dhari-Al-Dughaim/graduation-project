<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Meal>
 */
class MealFactory extends Factory
{
    public function definition(): array
    {
        $nameEn = fake()->unique()->words(2, true);
        $nameAr = 'وجبة ' . fake()->unique()->numberBetween(100, 999);

        return [
            'slug' => Str::slug($nameEn . '-' . fake()->unique()->numberBetween(1, 9999)),
            'name_en' => ucwords($nameEn),
            'name_ar' => $nameAr,
            'description_en' => fake()->sentence(8),
            'description_ar' => 'وصف قصير للوجبة',
            'category_en' => fake()->randomElement(['Burgers', 'Pasta', 'Salads', 'Wraps']),
            'category_ar' => fake()->randomElement(['برغر', 'باستا', 'سلطات', 'رابس']),
            'price' => fake()->randomFloat(2, 5, 40),
            'image_url' => fake()->imageUrl(640, 480, 'food', true),
            'is_active' => true,
        ];
    }
}
