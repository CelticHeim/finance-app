<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Installment;
use App\Models\InstallmentItem;
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
            'due_date' => 'required|date', // First payment date
        ]);

        $installment = new Installment();
        $installment->amount = $validated['amount'];
        $installment->description = $validated['description'] ?? '';
        $installment->category = $validated['category'];
        $installment->due_date = $validated['due_date'];
        $installment->number_of_installments = $validated['number_of_installments'];
        $installment->status = 'pending';
        $installment->save();

        $items = [];
        for ($i = 1; $i <= $validated['number_of_installments']; $i++) {
            $items[] = new InstallmentItem([
                'amount' => $validated['amount'] / $validated['number_of_installments'],
                'payment_date' => Carbon::createFromFormat('Y-m-d', $validated['due_date'])->addMonths($i - 1)->format('Y-m-d'),
                'status' => 'pending',
                'installment_id' => $installment->id,
            ]);
        }

        $installment->items()->saveMany($items);

        return response()->json([
            'message' => 'Gasto a cuotas creado exitosamente',
            'data' => $installment->load('items'),
        ], 201);
    }

    public function show(Installment $installment) {
        return response()->json([
            'message' => 'Detalle del gasto a cuotas',
            'data' => $installment->load('items.transaction'),
        ]);
    }
}
