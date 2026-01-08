<?php

namespace Database\Seeders;

use App\Models\Income;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $incomeData = [
            [
                'amount' => 3500.00,
                'category' => 'Salario',
                'description' => 'Salario mensual',
            ],
            [
                'amount' => 800.00,
                'category' => 'Freelance',
                'description' => 'Trabajo freelance',
            ],
            [
                'amount' => 500.00,
                'category' => 'Bonificación',
                'description' => 'Bonificación extra',
            ],
            [
                'amount' => 1200.00,
                'category' => 'Inversión',
                'description' => 'Retorno de inversión',
            ],
            [
                'amount' => 400.00,
                'category' => 'Otros',
                'description' => 'Ingreso adicional',
            ],
        ];

        // Get current month's first and last day
        $now = new \DateTime();
        $firstDay = new \DateTime($now->format('Y-m-01'));
        $lastDay = new \DateTime($now->format('Y-m-t'));

        foreach ($incomeData as $income) {
            // Random date within current month
            $randomDay = rand($firstDay->format('d'), $lastDay->format('d'));
            $income['entry_date'] = $now->format('Y-m-') . str_pad($randomDay, 2, '0', STR_PAD_LEFT);

            Income::create($income);
        }
    }
}
