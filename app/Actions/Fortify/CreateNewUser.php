<?php

namespace App\Actions\Fortify;

use App\Jobs\SendWelcomeWhatsapp;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'mobile' => ['required', 'string', 'max:50'],
            'password' => $this->passwordRules(),
        ])->validate();

        $mobile = $input['mobile'];

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'mobile' => $mobile,
            'password' => $input['password'],
        ]);

        // Create customer record with mobile
        Customer::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $mobile,
            'whatsapp_number' => $mobile,
        ]);

        // Send welcome WhatsApp message
        SendWelcomeWhatsapp::dispatchSync($user, $mobile);

        return $user;
    }
}
