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

        // Calcular totales globales
        $summary = Transaction::selectRaw(
            'SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as totalIncome,
             SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as totalExpenses'
        )->first();

        // Calcular ingresos y deudas del mes actual
        $monthSummary = Transaction::selectRaw(
            'SUM(CASE WHEN type = "income" AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as currentMonthIncome,
             SUM(CASE WHEN (type = "expense" OR type = "installment") AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as transactionDebt',
            [$year, $month, $year, $month]
        )->first();

        // Sumar montos de gastos fijos (se repiten cada mes)
        $fixedDebt = Fixed::sum('amount') ?? 0;

        // Calcular deuda total del mes (expenses + installments + fixed)
        $currentMonthDebt = ($monthSummary->transactionDebt ?? 0) + $fixedDebt;

        $availableBalance = $summary->totalIncome - $summary->totalExpenses;

        return response()->json([
            'message' => 'Resumen financiero',
            'data' => [
                'available_balance' => $availableBalance,
                'total_debt' => $summary->totalExpenses,
                'current_month_income' => $monthSummary->currentMonthIncome,
                'current_month_debt' => $currentMonthDebt,
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
