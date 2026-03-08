<?php

use App\Http\Controllers\Backend\ReportsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/view-reports', [ReportsController::class, 'viewReports']);
    Route::get('/get-reports', [ReportsController::class, 'getReports']);
    Route::get('/get-reports/csv', [ReportsController::class, 'exportReportsCsv']);
    Route::get('/get-reports/pdf', [ReportsController::class, 'exportReportsPdf']);
});
