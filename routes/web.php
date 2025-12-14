<?php

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\OrderInvoiceController as AdminOrderInvoiceController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\OrderTrackingController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::post('/locale', LocaleController::class)->name('locale.switch');

Route::get('/', HomeController::class)->name('home');
Route::get('/cart', CartController::class)->name('cart');
Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::get('/orders/{order}/payment', [PaymentController::class, 'show'])->name('orders.payment');
Route::post('/orders/{order}/pay', [PaymentController::class, 'store'])->name('orders.pay');
Route::get('/orders/{order}/success', [PaymentController::class, 'success'])->name('orders.success');
Route::get('/orders/{order}/failure', [PaymentController::class, 'failure'])->name('orders.failure');
Route::get('/track', [OrderTrackingController::class, 'index'])->name('orders.track.lookup');
Route::post('/track/search', [OrderTrackingController::class, 'search'])->name('orders.track.search');
Route::get('/orders/code/{order:order_number}/track', [OrderTrackingController::class, 'showByCode'])->name('orders.track.code');
Route::get('/orders/{order}/track', [OrderTrackingController::class, 'show'])->name('orders.track');
Route::get('/orders/{order}/invoice', [OrderTrackingController::class, 'invoice'])->name('orders.invoice');
Route::get('/orders/{order}/details', [OrderTrackingController::class, 'details'])->name('orders.details');

Route::middleware('auth')->group(function () {
    Route::get('/my-orders', [CustomerOrderController::class, 'index'])->name('orders.mine');
    Route::get('/account', [App\Http\Controllers\UserProfileController::class, 'show'])->name('account.show');
    Route::patch('/account', [App\Http\Controllers\UserProfileController::class, 'update'])->name('account.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::get('/invoices', [AdminOrderInvoiceController::class, 'index'])->name('invoices.index');
    });

require __DIR__.'/settings.php';
