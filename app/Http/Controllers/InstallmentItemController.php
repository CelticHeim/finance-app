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

        if ($installmentItem->transaction) {
            return response()->json([
                'message' => 'La cuota ya tiene una transacción registrada',
                'data' => $installmentItem,
            ], 409);
        }

        $installmentItem->status = 'completed';
        $installmentItem->paid_at = Carbon::now();
        $installmentItem->save();

        $installment = $installmentItem->installment;

        Transaction::create([
            'amount' => $installment->amount / $installment->number_of_installments,
            'description' => $installment->description,
            'discount' => 0,
            'transaction_date' => $installmentItem->payment_date,
            'category' => $installment->category,
            'type' => 'installment',
            'status' => 'completed',
            'installment_item_id' => $installmentItem->id,
        ]);

        $completedCount = $installment->items()->where('status', 'completed')->count();
        $installment->current_installment = $completedCount;
        $installment->save();

        return response()->json([
            'message' => 'Cuota marcada como completada exitosamente',
            'data' => $installmentItem->load('transaction'),
        ], 200);
    }
}
