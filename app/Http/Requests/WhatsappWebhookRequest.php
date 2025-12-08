<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WhatsappWebhookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'recipient' => ['required', 'string', 'max:50'],
            'body' => ['required', 'string'],
            'type' => ['nullable', 'string', 'max:50'],
            'order_number' => ['nullable', 'string', 'max:50'],
            'payload' => ['nullable', 'array'],
        ];
    }
}
