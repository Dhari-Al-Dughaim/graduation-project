<?php
/**
 * Created by PhpStorm.
 * User: usamaahmed
 * Date: 7/15/17
 * Time: 5:56 PM
 */
return [
    'apiKey' => env('UPAYMENT_API_KEY', 'tap7'), //Your API Key Provided by Tap
    'merchantId' => env('UPAYMENT_MERCHANT_ID', 1014), //Your ID provided by Tap
    'userName' => env('UPAYMENT_USERNAME', "test"), //Your Username under UPAYMENT.
    "password" => "test",
    'currencyCode' => env('UPAYMENT_CURRENCY_CODE', "KWD"), //This is the currency of the invoice you are creating. (Details can be found in "Create a Payment" endpoint)
    "autoReturn" => env('UPAYMENT_AUTO_RETURN', "Y"),
    "errorUrl" => env('UPAYMENT_ERROR_URL', "https://github.com/nosuchpage"),
    "langCode" => env('UPAYMENT_LANG_CODE', "EN"),
    "postUrl" => env('UPAYMENT_POST_URL', "https://yourdomain.post.com"),
    "returnUrl" => env('UPAYMENT_RETURN_URL', "https://yourdomain.return.com"),
    'gatewayDefault' => "ALL",
    'paymentUrl' => env('UPAYMENT_PAYMENT_URL','https://tapapi.gotapnow.com/TapWebConnect/Tap/WebPay/PaymentRequest'),
    'order' => env('ORDER_MODEL_PATH') ? env('ORDER_MODEL_PATH') : 'App\Order'
];
