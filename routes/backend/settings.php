<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Settings\SettingsController;

Route::middleware('auth')->group(function () {
    Route::get('/view-settings', function () {
        return Inertia::render('settings/settings-page');
    });
    Route::post('/update-password', [SettingsController::class, 'updatePassword']);
    Route::post('/update-profile', [SettingsController::class, 'updateProfile']);

    Route::post('/update-profile-picture', [SettingsController::class, 'updateProfilePicture']);
});