<?php

use Illuminate\Support\Facades\Route;

// UPayment Routes - No authentication required since customers may be guests
Route::group(['namespace' => 'Usama\Upayment\Controllers'], function () {
    // API routes
    Route::group(['middleware' => 'api', 'prefix' => 'api'], function () {
        Route::post('upayment/payment', 'UPaymentController@makePaymentApi')->name('upayment.api.payment.create');
    });

    // Web routes - no auth required for guest checkout
    Route::group(['middleware' => ['web']], function () {
        Route::post('upayment/payment', 'UPaymentController@makePayment')->name('upayment.web.payment.create');
        Route::get('upayment/result', 'UPaymentController@result')->name('upayment.web.payment.result');
        Route::get('upayment/error', 'UPaymentController@error')->name('upayment.web.payment.error');
    });
});
