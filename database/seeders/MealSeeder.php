<?php

namespace Database\Seeders;

use App\Models\Meal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MealSeeder extends Seeder
{
    public function run(): void
    {
        $meals = [
            [
                'name_en' => 'Smoky BBQ Burger 🔥🍔',
                'name_ar' => 'برغر باربكيو مدخن 🔥🍔',
                'description_en' => 'Beef patty, smoky BBQ sauce, cheddar, crispy onions.',
                'description_ar' => 'لحم بقري مع صلصة باربكيو مدخنة، شيدر، وبصل مقرمش.',
                'category_en' => 'Burgers',
                'category_ar' => 'برغر',
                'price' => 11.99,
                'image_url' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
            ],
            [
                'name_en' => 'Classic Cheeseburger 🧀🍔',
                'name_ar' => 'تشيز برغر كلاسيك 🧀🍔',
                'description_en' => 'American cheese, lettuce, tomato, pickles, secret sauce.',
                'description_ar' => 'جبن أمريكي، خس، طماطم، مخلل، وصوص سري.',
                'category_en' => 'Burgers',
                'category_ar' => 'برغر',
                'price' => 9.50,
                'image_url' => 'https://images.unsplash.com/photo-1606756790138-261c9cde4000?w=800',
            ],
            [
                'name_en' => 'Spicy Crispy Chicken 🌶️🍗',
                'name_ar' => 'دجاج مقرمش حار 🌶️🍗',
                'description_en' => 'Crispy chicken, chili mayo, pickles, shredded lettuce.',
                'description_ar' => 'دجاج مقرمش، مايونيز حار، مخلل، وخس مقطع.',
                'category_en' => 'Chicken',
                'category_ar' => 'دجاج',
                'price' => 10.75,
                'image_url' => 'https://images.unsplash.com/photo-1608039755401-289c17527f13?w=800',
            ],
            [
                'name_en' => 'Truffle Mushroom Burger 🍄✨',
                'name_ar' => 'برغر الكمأة والفطر 🍄✨',
                'description_en' => 'Truffle aioli, sautéed mushrooms, Swiss cheese.',
                'description_ar' => 'كريمة كمأة، فطر سوتيه، جبنة سويسرية.',
                'category_en' => 'Burgers',
                'category_ar' => 'برغر',
                'price' => 13.25,
                'image_url' => 'https://images.unsplash.com/photo-1612874472278-5c1f9c67228c?w=800',
            ],
            [
                'name_en' => 'Garden Veggie Stack 🥬🥕',
                'name_ar' => 'برغر خضار صحي 🥬🥕',
                'description_en' => 'Grilled veggie patty, avocado, sprouts, lemon tahini.',
                'description_ar' => 'قرص خضار مشوي، أفوكادو، براعم، طحينية بالليمون.',
                'category_en' => 'Veggie',
                'category_ar' => 'نباتي',
                'price' => 9.99,
                'image_url' => 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=800',
            ],
            [
                'name_en' => 'Loaded Fries 🧂🍟',
                'name_ar' => 'بطاطس محملة 🧂🍟',
                'description_en' => 'Crispy fries, cheese sauce, jalapeños, chipotle mayo.',
                'description_ar' => 'بطاطس مقرمشة مع صوص جبن، هالبينو، ومايونيز شيبوتلي.',
                'category_en' => 'Sides',
                'category_ar' => 'مقبلات',
                'price' => 5.50,
                'image_url' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800',
            ],
            [
                'name_en' => 'Chocolate Shake 🍫🥤',
                'name_ar' => 'ميلك شيك شوكولاتة 🍫🥤',
                'description_en' => 'Rich chocolate, whipped cream, cocoa nibs.',
                'description_ar' => 'شوكولاتة غنية مع كريمة مخفوقة ورقائق كاكاو.',
                'category_en' => 'Drinks',
                'category_ar' => 'مشروبات',
                'price' => 4.75,
                'image_url' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
            ],
            [
                'name_en' => 'Caramel Crunch Shake 🍯🥤',
                'name_ar' => 'ميلك شيك كراميل مقرمش 🍯🥤',
                'description_en' => 'Salted caramel, vanilla ice cream, crunchy crumbs.',
                'description_ar' => 'كراميل مملح، آيسكريم فانيليا، فتات مقرمش.',
                'category_en' => 'Drinks',
                'category_ar' => 'مشروبات',
                'price' => 4.95,
                'image_url' => 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
            ],
        ];

        foreach ($meals as $meal) {
            Meal::updateOrCreate(
                ['slug' => Str::slug($meal['name_en'])],
                $meal
            );
        }
    }
}
