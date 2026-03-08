<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\AppointmentController;

Route::middleware('auth')->group(function () {
    Route::get('/view-appointments', [AppointmentController::class, 'viewAppointments'])->name('dashboard');
    Route::get('/get-appointments', [AppointmentController::class, 'getBookings']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateBookingStatus']);
});
