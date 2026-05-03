<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\AppointmentController;

Route::middleware('auth')->group(function () {
    Route::get('/view-appointments', [AppointmentController::class, 'viewAppointments'])->name('dashboard');
    Route::get('/get-appointments', [AppointmentController::class, 'getBookings']);
    Route::post('/appointments/walk-in', [AppointmentController::class, 'createWalkIn']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateBookingStatus']);
});
