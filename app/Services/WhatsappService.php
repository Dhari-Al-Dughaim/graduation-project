<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class WhatsappService
{
    protected string $token;
    protected string $instanceId;
    protected string $baseUrl;

    public function __construct()
    {
        $this->token = config('services.ultramsg.token', 'pvp1vp2f5ujd10m3');
        $this->instanceId = config('services.ultramsg.instance_id', 'instance154826');
        $this->baseUrl = 'https://api.ultramsg.com';
    }

    public function send(string $to, string $body): array
    {
        $to = $this->formatPhoneNumber($to);

        $params = [
            'token' => $this->token,
            'to' => $to,
            'body' => $body,
        ];

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "{$this->baseUrl}/{$this->instanceId}/messages/chat",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => http_build_query($params),
            CURLOPT_HTTPHEADER => [
                'content-type: application/x-www-form-urlencoded',
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            Log::error('WhatsApp API Error', ['error' => $err, 'to' => $to]);
            return ['success' => false, 'error' => $err];
        }

        $decoded = json_decode($response, true);
        Log::info('WhatsApp Message Sent', ['to' => $to, 'response' => $decoded]);

        return ['success' => true, 'response' => $decoded];
    }

    protected function formatPhoneNumber(string $phone): string
    {
        // Remove any non-numeric characters except +
        $phone = preg_replace('/[^0-9+]/', '', $phone);

        // Ensure it starts with + for international format
        if (!str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
