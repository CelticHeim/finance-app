<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\FixedController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta protegida con autenticación Sanctum
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('finances')->controller(FinanceController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/transactions', 'getTransactions');
    Route::get('/calendar', 'getCalendarTransactions');
    // Route::get('/summary', 'getSummary');
    // Route::get('/debts', 'getDebts');
    Route::get('/fixeds', 'getFixeds');
    Route::get('/installments', 'getInstallments');
});

Route::apiResource('incomes', IncomeController::class);
Route::apiResource('expenses', ExpenseController::class);
Route::apiResource('fixeds', FixedController::class);
Route::apiResource('installments', InstallmentController::class);
Route::post('transactions/{transaction}/complete', [TransactionController::class, 'complete']);
