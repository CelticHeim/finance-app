<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller {
    public function complete(Request $request, Transaction $transaction) {
        $validated = $request->validate([
            'discount' => 'nullable|numeric'
        ]);

        $transaction->status = 'completed';

        if (!empty($validated['discount'])) {
            $transaction->discount = $validated['discount'];
        }

        $transaction->save();

        return response()->json([
            'message' => 'Transaction marked as completed',
            'transaction' => $transaction->refresh()
        ]);
    }
}
