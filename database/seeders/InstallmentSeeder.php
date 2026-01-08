<?php

namespace Database\Seeders;

use App\Models\Installment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InstallmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $installmentData = [
            [
                'amount' => 500.00,
                'number_of_installments' => 12,
                'current_installment' => 1,
                'status' => 'pending',
            ],
            [
                'amount' => 300.00,
                'number_of_installments' => 6,
                'current_installment' => 2,
                'status' => 'pending',
            ],
            [
                'amount' => 200.00,
                'number_of_installments' => 4,
                'current_installment' => 1,
                'status' => 'pending',
            ],
            [
                'amount' => 150.00,
                'number_of_installments' => 3,
                'current_installment' => 1,
                'status' => 'pending',
            ],
            [
                'amount' => 400.00,
                'number_of_installments' => 8,
                'current_installment' => 3,
                'status' => 'pending',
            ],
        ];

        foreach ($installmentData as $installment) {
            // Set due date to a date in the future
            $dueDate = new \DateTime();
            $dueDate->modify('+' . rand(1, 60) . ' days');
            $installment['due_date'] = $dueDate->format('Y-m-d');

            Installment::create($installment);
        }
    }
}
