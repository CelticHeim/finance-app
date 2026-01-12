<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Installment;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InstallmentController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'number_of_installments' => 'required|integer|min:1|max:120',
            'due_date' => 'required|date',
        ]);

        // $validated['first_payment_date'] = $validated['due_date'];

        // $firstDate = Carbon::createFromFormat('Y-m-d', $validated['due_date']);
        // $lastDate = $firstDate->copy()->addMonths($validated['number_of_installments'] - 1);
        // $validated['last_payment_date'] = $lastDate->format('Y-m-d');

        // $installment = Installment::create($validated);

        $installment = new Installment();
        $installment->amount = $validated['amount'];
        $installment->description = $validated['description'] ?? '';
        $installment->category = $validated['category'];
        $installment->due_date = $validated['due_date'];
        $installment->number_of_installments = $validated['number_of_installments'];
        // $installment->current_installment = 0;

        // $firstPaymentDate = Carbon::createFromFormat('Y-m-d', $validated['due_date']);
        // $lastPaymentDate = $firstPaymentDate->copy()->addMonths($validated['number_of_installments'] - 1);

        // $installment->first_payment_date = $firstPaymentDate->format('Y-m-d');
        // $installment->last_payment_date = $lastPaymentDate->format('Y-m-d');
        $installment->status = 'pending';
        $installment->save();

        $amountPerInstallment = $validated['amount'] / $validated['number_of_installments'];
        $transactions = [];
        for ($i = 1; $i <= $validated['number_of_installments']; $i++) {
            $transactions[] = new Transaction([
                'description' => $validated['description'] . " - Cuota $i de " . $validated['number_of_installments'],
                'amount' => $amountPerInstallment,
                'discount' => 0,
                'transaction_date' => Carbon::createFromFormat('Y-m-d', $validated['due_date'])->addMonths($i - 1)->format('Y-m-d'),
                'category' => $validated['category'],
                'type' => 'installment',
                'status' => 'pending',
                'transactionable_id' => $installment->id,
                'transactionable_type' => Installment::class,
            ]);
        }

        $installment->transactions()->saveMany($transactions);

        return response()->json([
            'message' => 'Gasto a cuotas creado exitosamente',
            'data' => $installment,
        ], 201);
    }
}
