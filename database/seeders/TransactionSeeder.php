<?php

namespace Database\Seeders;

use App\Models\Fixed;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder {
    /**
     * Run the database seeds.
     * 
     * Este seeder crea transacciones de income, expense y fixed.
     * Las fechas son del mes actual (enero 2026).
     */
    public function run(): void {
        $now = Carbon::now(); // January 10, 2026
        
        // ===== INCOMES =====
        $incomeData = [
            [
                'amount' => 3500.00,
                'category' => 'Salario',
                'description' => 'Salario mensual',
                'transaction_date' => $now->clone()->setDay(5),
            ],
            [
                'amount' => 800.00,
                'category' => 'Freelance',
                'description' => 'Trabajo freelance',
                'transaction_date' => $now->clone()->setDay(8),
            ],
            [
                'amount' => 500.00,
                'category' => 'Bonificación',
                'description' => 'Bonificación extra',
                'transaction_date' => $now->clone()->setDay(10),
            ],
            [
                'amount' => 1200.00,
                'category' => 'Inversión',
                'description' => 'Retorno de inversión',
                'transaction_date' => $now->clone()->setDay(3),
            ],
            [
                'amount' => 400.00,
                'category' => 'Otros',
                'description' => 'Ingreso adicional',
                'transaction_date' => $now->clone()->setDay(15),
            ],
        ];

        foreach ($incomeData as $income) {
            Transaction::create([
                'amount' => $income['amount'],
                'category' => $income['category'],
                'description' => $income['description'],
                'transaction_date' => $income['transaction_date']->format('Y-m-d'),
                'discount' => 0,
                'type' => 'income',
                'status' => 'completed',
            ]);
        }

        // ===== EXPENSES =====
        $expenseData = [
            [
                'amount' => 1200.00,
                'category' => 'Alquiler',
                'description' => 'Alquiler mensual',
                'transaction_date' => $now->clone()->setDay(1),
            ],
            [
                'amount' => 350.00,
                'category' => 'Alimentos',
                'description' => 'Compra de groceries',
                'transaction_date' => $now->clone()->setDay(6),
            ],
            [
                'amount' => 150.00,
                'category' => 'Transporte',
                'description' => 'Gasolina y mantenimiento',
                'transaction_date' => $now->clone()->setDay(7),
            ],
            [
                'amount' => 80.00,
                'category' => 'Entretenimiento',
                'description' => 'Cine y actividades',
                'transaction_date' => $now->clone()->setDay(9),
            ],
            [
                'amount' => 250.00,
                'category' => 'Salud',
                'description' => 'Medicinas y médico',
                'transaction_date' => $now->clone()->setDay(12),
            ],
        ];

        foreach ($expenseData as $expense) {
            Transaction::create([
                'amount' => $expense['amount'],
                'category' => $expense['category'],
                'description' => $expense['description'],
                'transaction_date' => $expense['transaction_date']->format('Y-m-d'),
                'discount' => 0,
                'type' => 'expense',
                'status' => 'completed',
            ]);
        }

        // ===== FIXED TRANSACTIONS =====
        // Crear transacciones para cada Fixed para los próximos 3 meses
        $fixedExpenses = Fixed::all();
        
        for ($month = 0; $month < 3; $month++) {
            foreach ($fixedExpenses as $fixed) {
                // Extract day from due_date
                $dayOfMonth = $fixed->due_date->day;
                
                $transactionDate = $now->clone()
                    ->addMonths($month)
                    ->setDay($dayOfMonth);
                
                // Skip if the day doesn't exist in that month
                if ($transactionDate->day != $dayOfMonth) {
                    $transactionDate = $transactionDate->lastDayOfMonth();
                }

                Transaction::create([
                    'amount' => $fixed->amount,
                    'description' => $fixed->description,
                    'discount' => 0,
                    'transaction_date' => $transactionDate->format('Y-m-d'),
                    'category' => $fixed->category,
                    'type' => 'fixed',
                    'status' => 'pending',
                    'transactionable_id' => $fixed->id,
                    'transactionable_type' => Fixed::class,
                ]);
            }
        }
    }
}
