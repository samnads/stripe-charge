<?php

use App\Http\Controllers\BuyController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', [ProductController::class, 'index'])->name('products');
Route::get('/buy/{product_id}', [BuyController::class, 'buy'])->name('buy');
Route::post('/charge', [BuyController::class, 'charge']);
