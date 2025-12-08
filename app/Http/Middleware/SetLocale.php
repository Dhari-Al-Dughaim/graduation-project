<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * Sets the application locale based on the session, authenticated user,
     * or a `lang` query parameter with a safe fallback.
     */
    public function handle(Request $request, Closure $next)
    {
        $supported = ['en', 'ar'];
        $requested = $request->get('lang')
            ?? $request->session()->get('locale')
            ?? $request->user()?->preferred_locale
            ?? config('app.locale');

        $locale = in_array($requested, $supported, true) ? $requested : config('app.locale');

        app()->setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}
