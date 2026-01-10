<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Fixed;
use App\Models\Installment;
use App\Models\Transaction;
use Illuminate\Http\Request;

class FinanceController extends Controller {
    public function index(Request $request) {
        $month = $request->query('month');
        $year = $request->query('year');
        $limit = $request->query('limit', 10);
        $types = $request->query('types'); // 'income,expense' format

        $transactions = Transaction::with('transactionable')
            ->byMonthAndYear($month, $year)
            ->byType($types)
            ->orderByDesc('transaction_date')
            ->paginate($limit);

        return response()->json([
            'message' => 'Lista de transacciones',
            'data' => $transactions,
        ]);
    }

    public function getSummary(Request $request) {
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        // Una sola consulta que calcula todos los agregados
        $summary = Transaction::selectRaw(
            'SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as totalIncome,
             SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as totalExpenses,
             SUM(CASE WHEN type = "income" AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as currentMonthIncome,
             SUM(CASE WHEN type = "expense" AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as currentMonthDebt',
            [$year, $month, $year, $month]
        )->first();

        $availableBalance = $summary->totalIncome - $summary->totalExpenses;

        return response()->json([
            'message' => 'Resumen financiero',
            'data' => [
                'available_balance' => $availableBalance,
                'total_debt' => $summary->totalExpenses,
                'current_month_income' => $summary->currentMonthIncome,
                'current_month_debt' => $summary->currentMonthDebt,
            ],
        ]);
    }

    public function getDebts() {
        $fixeds = Fixed::all();
        $installments = Installment::where('status', 'pending')->get();

        return response()->json([
            'message' => 'Lista de deudas (gastos fijos y cuotas)',
            'data' => [
                'fixeds' => $fixeds,
                'installments' => $installments,
            ],
        ]);
    }
}
