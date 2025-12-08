<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
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
            'status' => ['required', 'in:pending,confirmed,preparing,out_for_delivery,delivered,cancelled'],
            'payment_status' => ['nullable', 'in:unpaid,pending,paid,failed'],
            'delivery_eta_minutes' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
