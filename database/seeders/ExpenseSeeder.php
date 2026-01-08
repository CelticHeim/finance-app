<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expenseData = [
            [
                'amount' => 1200.00,
                'discount' => 0,
                'category' => 'Alquiler',
                'description' => 'Alquiler mensual',
            ],
            [
                'amount' => 350.00,
                'discount' => 0,
                'category' => 'Alimentos',
                'description' => 'Compra de groceries',
            ],
            [
                'amount' => 150.00,
                'discount' => 0,
                'category' => 'Transporte',
                'description' => 'Gasolina y mantenimiento',
            ],
            [
                'amount' => 80.00,
                'discount' => 0,
                'category' => 'Entretenimiento',
                'description' => 'Cine y actividades',
            ],
            [
                'amount' => 250.00,
                'discount' => 20,
                'category' => 'Salud',
                'description' => 'Medicinas y médico',
            ],
        ];

        // Get current month's first and last day
        $now = new \DateTime();
        $firstDay = new \DateTime($now->format('Y-m-01'));
        $lastDay = new \DateTime($now->format('Y-m-t'));

        foreach ($expenseData as $expense) {
            // Random date within current month
            $randomDay = rand($firstDay->format('d'), $lastDay->format('d'));
            $expense['expense_date'] = $now->format('Y-m-') . str_pad($randomDay, 2, '0', STR_PAD_LEFT);

            Expense::create($expense);
        }
    }
}
