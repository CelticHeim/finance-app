<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Fixed;
use App\Models\Income;
use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller {
    public function index(Request $request) {
        $perPage = $request->query('limit', 10);
        $page = $request->query('page', 1);
        $month = $request->query('month');
        $year = $request->query('year');

        $incomeQuery = DB::table('incomes')
            ->select(
                'id',
                'amount',
                'category',
                'description',
                'entry_date as transaction_date',
                DB::raw("'income' as type"),
                'created_at'
            )
            ->whereNull('deleted_at');

        $expenseQuery = DB::table('expenses')
            ->select(
                'id',
                'amount',
                'category',
                'description',
                'expense_date as transaction_date',
                DB::raw("'expense' as type"),
                'created_at'
            )
            ->whereNull('deleted_at');

        // Filtrar por mes y año si se proporcionan
        if ($month && $year) {
            $incomeQuery->whereYear('entry_date', $year)
                ->whereMonth('entry_date', $month);

            $expenseQuery->whereYear('expense_date', $year)
                ->whereMonth('expense_date', $month);
        }

        $transactions = $incomeQuery
            ->union($expenseQuery)
            ->orderByDesc('transaction_date')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'message' => 'Lista de ingresos y gastos paginada',
            'data' => $transactions,
            // 'data' => $transactions->items(),
            // 'pagination' => [
            //     'total' => $transactions->total(),
            //     'per_page' => $transactions->perPage(),
            //     'current_page' => $transactions->currentPage(),
            //     'last_page' => $transactions->lastPage(),
            //     'from' => $transactions->firstItem(),
            //     'to' => $transactions->lastItem(),
            // ],
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
