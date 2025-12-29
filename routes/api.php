<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta protegida con autenticación Sanctum
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
