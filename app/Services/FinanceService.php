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
             SUM(CASE WHEN (type = "expense" OR type = "installment") AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ? THEN amount ELSE 0 END) as transactionDebt',
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

        $paidFixedIds = collect($transactions)
            ->where('type', 'fixed')
            ->pluck('id')
            ->toArray();

        $fixeds = Fixed::all()->map(function($fixed) use ($month, $year, $paidFixedIds) {
            $day = $fixed->day_of_month ?? ($fixed->due_date?->day ?? 1);
            $transactionDate = Carbon::createFromDate($year, $month, $day, 'UTC')->toDateString();

            return (object) [
                'id' => $fixed->id,
                'type' => 'fixed',
                'description' => $fixed->description,
                'category' => $fixed->category,
                'amount' => $fixed->amount,
                'transaction_date' => $transactionDate,
                'status' => in_array($fixed->id, $paidFixedIds) ? 'paid' : 'pending',
            ];
        });

        return $transactions->concat($fixeds);
    }
}

