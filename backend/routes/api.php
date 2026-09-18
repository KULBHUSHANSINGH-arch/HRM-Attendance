<?php

use App\Http\Controllers\Api\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\HolidayController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\AttendanceSelfController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    Route::post('/attendance/login', [AttendanceSelfController::class, 'markLogin']);
    Route::post('/attendance/logout', [AttendanceSelfController::class, 'markLogout']);
    Route::get('/attendance/today', [AttendanceSelfController::class, 'today']);
    Route::get('/attendance/history', [AttendanceSelfController::class, 'history']);

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::apiResource('employees', EmployeeController::class);

        Route::get('attendances', [AdminAttendanceController::class, 'index']);
        Route::post('attendances', [AdminAttendanceController::class, 'store']);
        Route::put('attendances/{attendance}', [AdminAttendanceController::class, 'update']);
        Route::delete('attendances/{attendance}', [AdminAttendanceController::class, 'destroy']);

        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::get('reports/daily', [ReportController::class, 'daily']);
        Route::get('reports/daily/export', [ReportController::class, 'dailyExport']);
        Route::get('reports/monthly', [ReportController::class, 'monthly']);
        Route::get('reports/monthly/export', [ReportController::class, 'monthlyExport']);

        Route::get('holidays', [HolidayController::class, 'index']);
        Route::post('holidays', [HolidayController::class, 'store']);
        Route::delete('holidays/{holiday}', [HolidayController::class, 'destroy']);
    });
});
