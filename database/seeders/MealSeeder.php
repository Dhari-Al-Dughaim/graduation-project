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
                'name_en' => 'Classic Smash Beef Burger',
                'name_ar' => 'برغر بيف سماش كلاسيك',
                'description_en' => 'Double smashed beef patties, American cheese, house sauce, pickles.',
                'description_ar' => 'قطعتا لحم بقرية سماش مع جبنة أمريكية وصوص خاص ومخلل.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 11.50,
                'image_url' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name_en' => 'Double Cheddar Stack',
                'name_ar' => 'دابل تشيدر ستاك',
                'description_en' => 'Two juicy beef patties, sharp cheddar, caramelized onions, buttered brioche.',
                'description_ar' => 'قطعتان من اللحم البقري العصير مع تشيدر قوي وبصل كاراميل على خبز بريوش.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 12.75,
                'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name_en' => 'Smokehouse BBQ Burger',
                'name_ar' => 'برغر سموك هاوس باربكيو',
                'description_en' => 'Charred beef patty, smoky BBQ glaze, crispy onions, aged cheddar.',
                'description_ar' => 'برغر لحم مشوي مع صلصة باربكيو مدخنة وبصل مقرمش وتشيدر معتق.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 12.95,
                'image_url' => 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name_en' => 'Jalapeño Crunch Burger',
                'name_ar' => 'برغر هالبينو كرنش',
                'description_en' => 'Pepper jack cheese, crispy jalapeños, chipotle mayo, smashed beef patty.',
                'description_ar' => 'جبن بيبر جاك مع هالبينو مقرمش ومايونيز شيبوتلي ولحم بقري سماش.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 12.25,
                'image_url' => 'https://images.unsplash.com/photo-1612874472278-5c1f9c67228c?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name_en' => 'Truffle Mushroom Swiss',
                'name_ar' => 'برغر كمأة بعيش الغراب وسويس',
                'description_en' => 'Seared beef, truffle aioli, sautéed mushrooms, melted Swiss cheese.',
                'description_ar' => 'لحم بقر محمر مع آيولي الكمأة وفطر سوتيه وجبنة سويسرية ذائبة.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 13.50,
                'image_url' => 'https://images.unsplash.com/photo-1606756790138-261c9cde4000?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name_en' => 'Blue Cheese & Onion Burger',
                'name_ar' => 'برغر بلو تشيز والبصل',
                'description_en' => 'Creamy blue cheese, caramelized onions, arugula, prime beef patty.',
                'description_ar' => 'جبن أزرق كريمي مع بصل كاراميل وجرجير على قرص لحم بقري فاخر.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 13.00,
                'image_url' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name_en' => 'Black Angus Bacon Burger',
                'name_ar' => 'برغر بلاك أنغوس مع بيف بيكون',
                'description_en' => 'Flame-grilled Angus beef, beef bacon, smoked gouda, pickled onions.',
                'description_ar' => 'لحم أنغوس مشوي على اللهب مع بيف بيكون وجودة مدخنة وبصل مخلل.',
                'category_en' => 'Beef Burgers',
                'category_ar' => 'برغر لحم بقري',
                'price' => 13.95,
                'image_url' => 'https://images.unsplash.com/photo-1585238342028-9085c1bc1c63?auto=format&fit=crop&w=800&q=80',
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
