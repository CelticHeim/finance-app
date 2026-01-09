<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ExpenseController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string',
            'transaction_date' => 'required|date',
            'category' => 'required|string|max:255',
            // 'is_fixed' => 'sometimes|boolean',
            // 'is_installment' => 'sometimes|boolean',
            // 'total_installments' => 'required_if:is_installment,true|integer|min:1',
            // 'due_day' => 'required_if:is_installment,true|integer|min:1|max:31',
        ]);

        $expense = new Transaction();
        $expense->amount = $validated['amount'];
        $expense->description = $validated['description'];
        $expense->transaction_date = $validated['transaction_date'];
        $expense->category = $validated['category'];
        $expense->type = 'expense';
        $expense->status = 'completed';
        $expense->save();

        return response()->json([
            'message' => 'Gasto registrado exitosamente',
            'data' => $expense->load('installments'),
        ], 201);
    }
}
