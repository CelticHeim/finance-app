<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Fixed;
use App\Models\Income;
use App\Models\Installment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        // Total de ingresos
        $totalIncome = DB::table('incomes')
            ->whereNull('deleted_at')
            ->sum('amount');

        // Total de gastos (deuda total)
        $totalExpenses = DB::table('expenses')
            ->whereNull('deleted_at')
            ->sum('amount');

        // Balance disponible (ingresos - gastos)
        $availableBalance = $totalIncome - $totalExpenses;

        // Ingresos del mes actual
        $currentMonthIncome = DB::table('incomes')
            ->whereNull('deleted_at')
            ->whereYear('entry_date', $year)
            ->whereMonth('entry_date', $month)
            ->sum('amount');

        // Deuda del mes actual
        $currentMonthDebt = DB::table('expenses')
            ->whereNull('deleted_at')
            ->whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->sum('amount');

        return response()->json([
            'message' => 'Resumen financiero',
            'data' => [
                'available_balance' => $availableBalance,
                'total_debt' => $totalExpenses,
                'current_month_income' => $currentMonthIncome,
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
