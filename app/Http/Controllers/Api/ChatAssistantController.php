<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ChatAssistantController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'messages' => ['sometimes', 'array'],
            'messages.*.role' => ['required_with:messages', 'in:user,assistant'],
            'messages.*.content' => ['required_with:messages', 'string', 'max:2000'],
            'locale' => ['nullable', 'in:en,ar'],
        ]);

        $locale = $validated['locale'] ?? app()->getLocale();
        $latestMessages = collect($validated['messages'] ?? [])
            ->map(fn (array $message) => [
                'role' => $message['role'],
                'content' => trim($message['content']),
            ])
            ->filter(fn (array $message) => $message['content'] !== '')
            ->slice(-8)
            ->values()
            ->all();

        $meals = Meal::query()
            ->where('is_active', true)
            ->orderBy('name_en')
            ->get([
                'name_en',
                'name_ar',
                'description_en',
                'description_ar',
                'price',
                'image_url',
            ])
            ->map(function (Meal $meal) {
                return [
                    'name_en' => $meal->name_en,
                    'name_ar' => $meal->name_ar,
                    'description_en' => $meal->description_en,
                    'description_ar' => $meal->description_ar,
                    'price' => (float) $meal->price,
                    'image_url' => $meal->image_url,
                ];
            })
            ->values();

        $menuLine = $locale === 'ar'
            ? 'اكتب (1) لعرض المنيو أو (2) لطلب تواصل من فريق الخط الساخن. إذا أردت تقيم طلبك أو تجربة المطعم أخبرني بالتفاصيل.'
            : 'Reply with (1) for the menu or (2) if you want our hotline team to call you. You can also rate your meal or share feedback.';

        $systemPrompt = implode("\n", [
            "You are the AI assistant for a beef burger restaurant. Be proactive, warm, and concise.",
            "Always respond in the user's language preference: {$locale}.",
            "Primary missions:",
            "- Greet and clearly offer numbered options: 1 for the menu, 2 to have the hotline/support team call them back (ask for their phone number).",
            "- Encourage diners to rate meals and share their ordering experience.",
            "- When asked for the menu or option 1 is chosen, present the meals below in a neat, modern bullet list with name, price (KWD), and a short description in the user's language.",
            "- If they ask for suggestions, pick two or three items from the provided list.",
            "If no hotline number is provided, ask for the guest's phone so the team can call back.",
            "Keep responses brief and structured with line breaks or bullets when useful.",
            "Meals data (use name_ar/description_ar when replying in Arabic): " . $meals->toJson(JSON_UNESCAPED_UNICODE),
            "Reminder line to reuse when greeting: {$menuLine}",
        ]);

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ...$latestMessages,
            ['role' => 'user', 'content' => trim($validated['message'])],
        ];

        $apiKey = config('services.openai.key', env('OPENAI_API_KEY'));

        if (!$apiKey) {
            return response()->json([
                'reply' => $locale === 'ar'
                    ? 'تعذر الاتصال بمساعد الذكاء الاصطناعي حالياً. حاول مجدداً لاحقاً أو اطلب الدعم من الفريق.'
                    : 'Unable to reach the AI assistant right now. Please try again later or ask our team directly.',
            ], 503);
        }

        $response = Http::withToken($apiKey)
            ->timeout(15)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => $messages,
                'temperature' => 0.7,
                'max_tokens' => 550,
            ]);

        if ($response->failed()) {
            $fallback = $locale === 'ar'
                ? 'لم أتمكن من إحضار الرد الآن. جرّب مرة أخرى أو شاركني رقمك ليتواصل معك فريق الدعم.'
                : 'I could not reach the assistant just now. Please try again or share your phone number so our team can call you back.';

            return response()->json([
                'reply' => $fallback,
                'error' => $response->json('error.message') ?? 'service_unavailable',
            ], $response->status() ?: 500);
        }

        $reply = data_get($response->json(), 'choices.0.message.content');

        return response()->json([
            'reply' => $reply ?? '',
            'id' => Str::uuid()->toString(),
        ]);
    }
}
