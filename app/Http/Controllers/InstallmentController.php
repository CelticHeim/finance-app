<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Installment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InstallmentController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'number_of_installments' => 'required|integer|min:1|max:120',
            'due_date' => 'required|date',
        ]);

        $validated['first_payment_date'] = $validated['due_date'];
        
        $firstDate = Carbon::createFromFormat('Y-m-d', $validated['due_date']);
        $lastDate = $firstDate->copy()->addMonths($validated['number_of_installments'] - 1);
        $validated['last_payment_date'] = $lastDate->format('Y-m-d');

        $installment = Installment::create($validated);

        return response()->json([
            'message' => 'Gasto a cuotas creado exitosamente',
            'data' => $installment,
        ], 201);
    }
}
