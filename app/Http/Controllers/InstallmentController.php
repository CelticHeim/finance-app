<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Installment;
use Illuminate\Http\Request;

class InstallmentController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1',
            'number_of_installments' => 'required|integer|min:1',
            'due_date' => 'required|date',
        ]);

        $installment = Installment::create($validated);

        return response()->json([
            'message' => 'Gasto a cuotas creado exitosamente',
            'data' => $installment,
        ], 201);
    }
}
