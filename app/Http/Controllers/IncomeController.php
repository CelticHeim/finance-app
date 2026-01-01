<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class IncomeController extends Controller {
    public function store(Request $request): JsonResponse {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'entry_date' => 'required|date',
        ]);

        $income = Income::create($validated);

        return response()->json([
            'message' => 'Ingreso registrado exitosamente',
            'data' => $income,
        ], 201);
    }
}
