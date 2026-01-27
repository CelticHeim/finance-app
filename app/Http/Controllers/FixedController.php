<?php

namespace App\Http\Controllers;

use App\Models\Fixed;
use App\Models\Transaction;
use Carbon\Carbon;
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

    public function complete(Request $request, Fixed $fixed) {
        $validated = $request->validate([
            'discount' => 'nullable|numeric|min:0',
            'payment_date' => 'required|date'
        ]);

        $paymentDate = Carbon::parse($validated['payment_date']);
        $month = $paymentDate->month;
        $year = $paymentDate->year;

        $transactionExists = Transaction::where('transactionable_id', $fixed->id)
            ->where('transactionable_type', Fixed::class)
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $month)
            ->first();

        if ($transactionExists) {
            return response()->json([
                'message' => 'Ya existe una transacción para este gasto fijo en el mes especificado',
                'data' => $transactionExists,
            ], 409);
        }

        // Calcular fecha usando el día del fixed (due_date) y el mes/año enviado
        $transactionDate = Carbon::createFromDate($year, $month, $fixed->due_date->day)->toDateString();

        $transaction = $fixed->transactions()->create([
            'amount' => $fixed->amount,
            'type' => 'fixed',
            'category' => $fixed->category,
            'description' => $fixed->description,
            'transaction_date' => $transactionDate,
            'discount' => $validated['discount'] ?? 0,
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => "Transacción de gasto fijo de {$fixed->description} creada exitosamente",
            'data' => $transaction,
        ], 201);
    }
}
