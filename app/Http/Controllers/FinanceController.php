<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Income;
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
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'message' => 'Lista de ingresos y gastos paginada',
            'data' => $transactions->items(),
            'pagination' => [
                'total' => $transactions->total(),
                'per_page' => $transactions->perPage(),
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'from' => $transactions->firstItem(),
                'to' => $transactions->lastItem(),
            ],
        ]);
    }
}
