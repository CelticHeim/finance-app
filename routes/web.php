<?php

use Illuminate\Support\Facades\Route;

// Todas las rutas devuelven la misma vista para que React Router maneje el enrutamiento
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
