<?php

namespace App\Http\Controllers;

use App\Http\Requests\LocaleSwitchRequest;
use Illuminate\Http\RedirectResponse;

class LocaleController extends Controller
{
    public function __invoke(LocaleSwitchRequest $request): RedirectResponse
    {
        $locale = $request->validated('locale');

        app()->setLocale($locale);
        $request->session()->put('locale', $locale);

        if ($request->user()) {
            $request->user()->forceFill(['preferred_locale' => $locale])->save();
        }

        return back();
    }
}
