<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Frontend\BookingPageController;

Route::get("/", [BookingPageController::class, 'index']);
Route::resource('/booking', BookingPageController::class)->only('index', 'create', 'store', 'edit', 'update', 'destroy');

// Route::post('/send-verification-code', [BookingPageController::class, 'sendVerificationCode']);
Route::post('/submit-appointment', [BookingPageController::class, 'submitAppointment']);
Route::get('/get-schedules/{date}', [BookingPageController::class, 'getSchedules']);
Route::get('/download-appointment/{id}', [BookingPageController::class, 'downloadAppointment']);