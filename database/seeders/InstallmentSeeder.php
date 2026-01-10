<?php

namespace Database\Seeders;

use App\Models\Installment;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InstallmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now(); // January 10, 2026
        
        $installmentData = [
            [
                'amount' => 500.00,
                'description' => 'Computadora portátil',
                'category' => 'Electrónica',
                'due_date' => $now->clone()->addMonths(1)->setDay(15),
                'number_of_installments' => 12,
            ],
            [
                'amount' => 300.00,
                'description' => 'Refrigerador',
                'category' => 'Electrodomésticos',
                'due_date' => $now->clone()->addMonths(1)->setDay(10),
                'number_of_installments' => 6,
            ],
            [
                'amount' => 200.00,
                'description' => 'Televisor',
                'category' => 'Electrónica',
                'due_date' => $now->clone()->addMonths(1)->setDay(20),
                'number_of_installments' => 4,
            ],
            [
                'amount' => 150.00,
                'description' => 'Bicicleta',
                'category' => 'Deportes',
                'due_date' => $now->clone()->addMonths(1)->setDay(5),
                'number_of_installments' => 3,
            ],
            [
                'amount' => 400.00,
                'description' => 'Muebles de sala',
                'category' => 'Muebles',
                'due_date' => $now->clone()->addMonths(1)->setDay(25),
                'number_of_installments' => 8,
            ],
        ];

        foreach ($installmentData as $installmentData) {
            $installment = Installment::create([
                'amount' => $installmentData['amount'],
                'description' => $installmentData['description'],
                'category' => $installmentData['category'],
                'due_date' => $installmentData['due_date']->format('Y-m-d'),
                'number_of_installments' => $installmentData['number_of_installments'],
                'status' => 'pending',
            ]);

            // Create transactions for each installment dynamically
            $amountPerInstallment = $installmentData['amount'] / $installmentData['number_of_installments'];
            $transactions = [];
            for ($i = 1; $i <= $installmentData['number_of_installments']; $i++) {
                $transactions[] = new Transaction([
                    'description' => $installmentData['description'] . " - Cuota $i de " . $installmentData['number_of_installments'],
                    'amount' => $amountPerInstallment,
                    'discount' => 0,
                    'transaction_date' => $installmentData['due_date']->clone()
                        ->addMonths($i - 1)->format('Y-m-d'),
                    'category' => $installmentData['category'],
                    'type' => 'installment',
                    'status' => 'pending',
                    'transactionable_id' => $installment->id,
                    'transactionable_type' => Installment::class,
                ]);
            }

            $installment->transactions()->saveMany($transactions);
        }
    }
}
