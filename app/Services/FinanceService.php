<?php

namespace App\Services;

use App\Models\Fixed;
use App\Models\Installment;
use App\Models\Transaction;
use Carbon\Carbon;

class FinanceService {
    public function getSummary($month, $year) {
        // Calcular totales globales
        $summary = Transaction::selectRaw(
            'SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as totalIncome,
             SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as totalExpenses'
        )->first();

        // Calcular ingresos y deudas del mes actual
        $monthSummary = Transaction::selectRaw(
            'SUM(CASE WHEN type = "income" AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as currentMonthIncome,
             SUM(CASE WHEN (type = "installment") AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as transactionDebt',
            [$year, $month, $year, $month]
        )->first();

        // Sumar montos de gastos fijos (se repiten cada mes)
        $fixedDebt = Fixed::sum('amount') ?? 0;

        // Calcular deuda total del mes (expenses + installments + fixed)
        $currentMonthDebt = ($monthSummary->transactionDebt ?? 0) + $fixedDebt;

        $availableBalance = $summary->totalIncome - $summary->totalExpenses;

        return [
            'available_balance' => $availableBalance,
            'total_debt' => $summary->totalExpenses,
            'current_month_income' => $monthSummary->currentMonthIncome,
            'current_month_debt' => $currentMonthDebt,
        ];
    }

    public function getFixeds() {
        return Fixed::all();
    }

    public function getInstallments() {
        return Installment::where('status', 'pending')->get();
    }

    public function getCalendarTransactions($month, $year) {
        $transactions = Transaction::with('transactionable')
            ->byMonthAndYear($month, $year)
            ->get();

        $fixeds = Fixed::all();
        $unpaidFixeds = array_diff(
            $fixeds->pluck('id')->toArray(),
            $transactions->where('type', 'fixed')->pluck('transactionable_id')->toArray()
        );

        $pendingFixedTransactions = collect($unpaidFixeds)->map(function ($fixedId) use ($month, $year, $fixeds) {
            $fixed = $fixeds->firstWhere('id', $fixedId);
            $day = $fixed->due_date?->day ?? 1;
            $transactionDate = Carbon::createFromDate($year, $month, $day, 'UTC')->toDateString();

            return (object) [
                'id' => uuid_create(),
                'type' => 'fixed',
                'description' => $fixed->description,
                'category' => $fixed->category,
                'amount' => $fixed->amount,
                'transaction_date' => $transactionDate,
                'status' => 'pending',
            ];
        });

        return $transactions->concat($pendingFixedTransactions);
    }
}
