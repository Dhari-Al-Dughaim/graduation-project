<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $locale = app()->getLocale();

        $meals = Meal::query()
            ->where('is_active', true)
            ->orderBy('name_en')
            ->get()
            ->map(function (Meal $meal) use ($locale) {
                return [
                    'id' => $meal->id,
                    'slug' => $meal->slug,
                    'name' => $meal->getName($locale),
                    'description' => $meal->getDescription($locale),
                    'category' => $locale === 'ar' ? $meal->category_ar : $meal->category_en,
                    'price' => (float) $meal->price,
                    'image_url' => $meal->image_url,
                ];
            });

        return Inertia::render('store/home', [
            'meals' => $meals,
            'locale' => $locale,
        ]);
    }
}
