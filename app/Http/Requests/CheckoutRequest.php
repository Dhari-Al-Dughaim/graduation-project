<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer.name' => ['required', 'string', 'max:255'],
            'customer.phone' => ['nullable', 'string', 'max:50'],
            'customer.email' => ['nullable', 'email', 'max:255'],
            'customer.locale' => ['nullable', 'in:en,ar'],
            'customer.whatsapp_number' => ['nullable', 'string', 'max:50'],
            'delivery_address' => ['nullable', 'string', 'max:255'],
            'delivery_city' => ['nullable', 'string', 'max:255'],
            'delivery_notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.meal_id' => ['required', 'exists:meals,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
