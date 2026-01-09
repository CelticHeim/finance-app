<?php

namespace Database\Seeders;

use App\Models\Fixed;
use App\Models\Installment;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // Crear transacciones para Fixed
        Fixed::all()->each(function ($fixed) {
            Transaction::create([
                'amount' => $fixed->amount,
                'description' => $fixed->description,
                'discount' => 0,
                'transaction_date' => now(),
                'category' => $fixed->category,
                'type' => 'fixed',
                'status' => 'pending',
                'transactionable_id' => $fixed->id,
                'transactionable_type' => Fixed::class,
            ]);
        });

        // Crear transacciones para Installments (una por cada plazo)
        Installment::all()->each(function ($installment) {
            collect(range(1, $installment->number_of_installments))->each(function ($installmentNum) use ($installment) {
                Transaction::create([
                    'amount' => $installment->amount / $installment->number_of_installments,
                    'description' => $installment->description . ' - Cuota ' . $installmentNum,
                    'discount' => 0,
                    'transaction_date' => now(),
                    'category' => $installment->category,
                    'type' => 'installment',
                    'status' => 'pending',
                    'transactionable_id' => $installment->id,
                    'transactionable_type' => Installment::class,
                ]);
            });
        });
    }
}
