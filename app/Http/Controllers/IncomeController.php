<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class IncomeController extends Controller {
    public function store(Request $request): JsonResponse {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string',
            'discount' => 'nullable|numeric|min:0',
            'transaction_date' => 'required|date',
            'category' => 'required|string',
        ]);

        // $income = Income::create($validated);
        $income = new Transaction();
        $income->amount = $validated['amount'];
        $income->description = $validated['description'];
        $income->discount = $validated['discount'] ?? 0;
        $income->transaction_date = $validated['transaction_date'];
        $income->category = $validated['category'];
        $income->type = 'income';
        $income->status = 'completed';
        $income->save();

        return response()->json([
            'message' => 'Ingreso registrado exitosamente',
            'data' => $income,
        ], 201);
    }
}
