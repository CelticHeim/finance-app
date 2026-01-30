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

        // Obtener datos del calendario que incluyen transactions, fixeds y summary
        $calendarData = $this->financeService->getCalendarTransactions($now->month, $now->year);
        $summary = $this->financeService->getSummary($now->month, $now->year);
        $installments = $this->financeService->getInstallments();
        $fixeds = $this->financeService->getFixeds();

        return response()->json([
            'message' => 'Resumen financiero y transacciones del mes actual',
            'data' => [
                'transactions' => $calendarData,
                'summary' => $summary,
                'installments' => $installments,
                'fixeds' => $fixeds,
            ],
        ]);
    }

    public function getTransactions(Request $request) {
        $month = $request->query('month');
        $year = $request->query('year');
        $limit = $request->query('limit', 10);
        $types = $request->query('types', ''); // 'income,expense' format

        $transactions = Transaction::with('installmentItem.installment')
            ->byMonthAndYear($month, $year)
            ->byType($types)
            ->orderByDesc('transaction_date')
            ->paginate($limit);

        return response()->json([
            'message' => 'Lista de transacciones',
            'data' => $transactions,
        ]);
    }

    public function getCalendarTransactions(Request $request) {
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        $transactions = $this->financeService->getCalendarTransactions($month, $year);
        $summary = $this->financeService->getSummary($month, $year);

        return response()->json([
            'message' => 'Transacciones del calendario',
            'data' => [
                'transactions' => $transactions,
                'summary' => $summary,
            ],
        ]);
    }

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
