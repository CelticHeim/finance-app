<?php

use App\Http\Controllers\ExampleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta protegida con autenticación Sanctum
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas de ejemplo (públicas)
Route::get('/examples', [ExampleController::class, 'index']);
Route::post('/examples', [ExampleController::class, 'store']);
Route::get('/examples/{id}', [ExampleController::class, 'show']);
Route::put('/examples/{id}', [ExampleController::class, 'update']);
Route::delete('/examples/{id}', [ExampleController::class, 'destroy']);

// Puedes agrupar rutas protegidas así:
Route::middleware('auth:sanctum')->group(function () {
    // Aquí van las rutas que requieren autenticación
    // Route::get('/protected-data', [SomeController::class, 'index']);
});
