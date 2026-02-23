<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\SchedulesController;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
       Route::get('/view-schedules', function () {
        return Inertia::render('schedule/schedules-page');
    });
    Route::resource('/schedules', SchedulesController::class)->only('index', 'create', 'store', 'edit', 'update', 'destroy');
});