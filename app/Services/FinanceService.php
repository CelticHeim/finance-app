<?php

namespace App\Services;

use App\Models\Fixed;
use App\Models\Installment;
use App\Models\InstallmentItem;
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
        return Installment::where('status', 'pending')->with('items')->get();
    }

    public function getCalendarTransactions($month, $year) {
        $transactions = Transaction::with('installmentItem')
            ->byMonthAndYear($month, $year)
            ->get();

        $fixeds = Fixed::all();

        $paidFixedIds = $transactions->where('type', 'fixed')->pluck('id')->toArray();
        $unpaidFixedIds = array_diff($fixeds->pluck('id')->toArray(), $paidFixedIds);

        $transactionTemp = [];
        foreach ($unpaidFixedIds as $fixedId) {
            $fixed = $fixeds->firstWhere('id', $fixedId);
            $transactionDate = Carbon::createFromDate($year, $month, $fixed->due_date->day)->toDateString();

            $transactionTemp[] = (object) [
                'id' => null,
                'type' => 'fixed',
                'description' => $fixed->description,
                'category' => $fixed->category,
                'amount' => (string) $fixed->amount,
                'discount' => '0',
                'transaction_date' => $transactionDate,
                'status' => 'pending',
                'created_at' => null,
                'updated_at' => null,
                'deleted_at' => null,
                'is_placeholder' => true,
            ];
        }

        $items = InstallmentItem::where('status', 'pending')
            ->with('installment')
            ->byMonthAndYear($month, $year)
            ->get();

        foreach ($items as $item) {
            $transactionTemp[] = (object) [
                'id' => null,
                'type' => 'installment',
                'description' => $item->installment->description,
                'category' => $item->installment->category,
                'amount' => (string) $item->amount,
                'discount' => '0',
                'transaction_date' => $item->payment_date instanceof \Carbon\Carbon
                    ? $item->payment_date->toDateString()
                    : $item->payment_date,
                'status' => 'pending',
                'installment_item_id' => $item->id,
                'created_at' => null,
                'updated_at' => null,
                'deleted_at' => null,
                'is_placeholder' => true,
            ];
        }

        return collect($transactionTemp)->concat($transactions);
    }
}
