<?php

namespace App\Services;

use App\Models\Fixed;
use App\Models\Installment;
use App\Models\InstallmentItem;
use App\Models\Transaction;
use Carbon\Carbon;

class FinanceService {
    public function getSummary($month, $year) {
        // Obtener el balance disponible sumando todos los ingresos y restando todos los gastos
        $totalIncome = Transaction::where('type', 'income')->sum('amount');
        $totalExpenses = Transaction::whereIn('type', ['expense', 'installment', 'fixed'])->sum('amount');

        $availableBalance = $totalIncome - $totalExpenses;

        // Obtener la deuda total solo de los InstallmentItem pendientes
        $installmentDebt = InstallmentItem::where('status', 'pending')->sum('amount');

        // Obtener los ingresos solo del mes actual
        $currentMonthIncome = Transaction::where('type', 'income')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $month)
            ->sum('amount');

        // Obtener la deuda del mes actual sumando los gastos fijos y los InstallmentItem pendientes
        $fixedDebt = Fixed::sum('amount') ?? 0;
        $currentMonthDebt = $installmentDebt + $fixedDebt;

        return [
            'available_balance' => $availableBalance,
            'total_debt' => $totalExpenses,
            'current_month_income' => $currentMonthIncome,
            'current_month_debt' => $currentMonthDebt,
        ];
    }

    public function getFixeds() {
        return Fixed::all();
    }

    public function getInstallments() {
        return Installment::with('items')->get();
    }

    public function getCalendarTransactions($month, $year) {
        $transactions = Transaction::with('installmentItem')
            ->byMonthAndYear($month, $year)
            ->get();

        // return $transactions;

        $fixeds = Fixed::all();

        $paidFixedIds = $transactions
            ->where('type', 'fixed')
            ->where('transactionable_type', 'App\\Models\\Fixed')
            ->pluck('transactionable_id')
            ->filter()
            ->toArray();
        $unpaidFixedIds = array_diff($fixeds->pluck('id')->toArray(), $paidFixedIds);

        $transactionTemp = [];
        foreach ($unpaidFixedIds as $fixedId) {
            $fixed = $fixeds->firstWhere('id', $fixedId);
            $dueDay = $fixed->due_date->day;

            $lastDayOfMonth = Carbon::createFromDate($year, $month, 1)->endOfMonth()->day;
            $adjustedDay = min($dueDay, $lastDayOfMonth);

            $transactionDate = Carbon::createFromDate($year, $month, $adjustedDay)->toDateString();

            $transactionTemp[] = (object) [
                'id' => null,
                'type' => 'fixed',
                'description' => $fixed->description,
                'category' => $fixed->category,
                'amount' => (string) $fixed->amount,
                'discount' => '0',
                'transaction_date' => $transactionDate,
                'status' => 'pending',
                'transactionable_id' => $fixed->id,
                'transactionable_type' => 'App\\Models\\Fixed',
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
                'transaction_date' => $item->payment_date->toDateString(),
                'status' => 'pending',
                'transactionable_id' => $item->id,
                'transactionable_type' => 'App\\Models\\InstallmentItem',
                'created_at' => null,
                'updated_at' => null,
                'deleted_at' => null,
                'is_placeholder' => true,
            ];
        }

        return collect($transactionTemp)->concat($transactions);
    }
}
