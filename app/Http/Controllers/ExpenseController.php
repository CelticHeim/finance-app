<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'expense_date' => 'required|date',
            'is_fixed' => 'sometimes|boolean',
            'is_installment' => 'sometimes|boolean',
            'total_installments' => 'required_if:is_installment,true|integer|min:1',
            'due_day' => 'required_if:is_installment,true|integer|min:1|max:31',
        ]);

        $expense = Expense::create([
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'expense_date' => $validated['expense_date'],
            'is_fixed' => $validated['is_fixed'] ?? false,
            'is_installment' => $validated['is_installment'] ?? false,
        ]);

        return response()->json([
            'message' => 'Gasto registrado exitosamente',
            'data' => $expense->load('installments'),
        ], 201);
    }
}
