<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Frontend\BookingPageController;

Route::get("/", [BookingPageController::class, 'index']);
Route::resource('/booking', BookingPageController::class)->only('index', 'create', 'store', 'edit', 'update', 'destroy');