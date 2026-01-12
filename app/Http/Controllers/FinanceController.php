<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\FinanceService;
use Illuminate\Http\Request;

class FinanceController extends Controller {
    protected FinanceService $financeService;

    public function __construct(FinanceService $financeService) {
        $this->financeService = $financeService;
    }

    public function index() {
        $now = now();

        $transactions = Transaction::with('transactionable')
            ->byMonthAndYear($now->month, $now->year)
            ->orderByDesc('transaction_date')
            ->get();
        $summary = $this->financeService->getSummary($now->month, $now->year);

        $fixeds = $this->financeService->getFixeds();
        $installments = $this->financeService->getInstallments();

        return response()->json([
            'message' => 'Resumen financiero y transacciones del mes actual',
            'data' => [
                'transactions' => $transactions,
                'summary' => $summary,
                'fixeds' => $fixeds,
                'installments' => $installments,
            ],
        ]);
    }

    public function getTransactions(Request $request) {
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

        $summaryData = $this->financeService->getSummary($month, $year);

        return response()->json([
            'message' => 'Resumen financiero',
            'data' => $summaryData,
        ]);
    }

    // public function getDebts() {
    //     $debtsData = $this->financeService->getDebts();

    //     return response()->json([
    //         'message' => 'Lista de deudas (gastos fijos y cuotas)',
    //         'data' => $debtsData,
    //     ]);
    // }

    public function getFixeds() {
        $fixeds = $this->financeService->getFixeds();

        return response()->json([
            'message' => 'Lista de gastos fijos',
            'data' => $fixeds,
        ]);
    }

    public function getInstallments() {
        $installments = $this->financeService->getInstallments();

        return response()->json([
            'message' => 'Lista de cuotas pendientes',
            'data' => $installments,
        ]);
    }
}
