<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InstallmentItem;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InstallmentItemController extends Controller {
    public function show(InstallmentItem $installmentItem) {
        return response()->json([
            'message' => 'Detalle de la cuota',
            'data' => $installmentItem,
        ]);
    }

    public function complete(Request $request, InstallmentItem $installmentItem) {
        if ($installmentItem->status === 'completed') {
            return response()->json([
                'message' => 'La cuota ya ha sido completada',
                'data' => $installmentItem,
            ], 409);
        }

        $installmentItem->status = 'completed';
        $installmentItem->save();

        $installment = $installmentItem->installment;

        Transaction::create([
            'amount' => $installment->amount / $installment->number_of_installments,
            'description' => $installment->description,
            'discount' => 0,
            'transaction_date' => Carbon::now(),
            'category' => $installment->category,
            'type' => 'installment',
            'status' => 'completed',
            'transactionable_id' => $installment->id,
            'transactionable_type' => get_class($installment),
        ]);

        return response()->json([
            'message' => 'Cuota marcada como completada exitosamente',
            'data' => $installmentItem->refresh(),
        ], 200);
    }
}
