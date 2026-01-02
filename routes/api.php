<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\FixedController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\InstallmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta protegida con autenticación Sanctum
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/finances', [FinanceController::class, 'index']);
Route::get('/finances/summary', [FinanceController::class, 'getSummary']);
Route::get('/finances/debts', [FinanceController::class, 'getDebts']);

Route::apiResource('incomes', IncomeController::class);
Route::apiResource('expenses', ExpenseController::class);
Route::apiResource('fixeds', FixedController::class);
Route::apiResource('installments', InstallmentController::class);
