<?php

namespace App\Http\Controllers;

use App\Models\Fixed;
use Illuminate\Http\Request;

class FixedController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'due_date' => 'required|integer|min:1|max:31',
        ]);

        $fixed = Fixed::create($validated);

        return response()->json([
            'message' => 'Gasto fijo creado exitosamente',
            'data' => $fixed,
        ], 201);
    }
}
