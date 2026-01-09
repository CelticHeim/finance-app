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
                'description' => 'Computadora portátil',
                'category' => 'Electrónica',
                'due_date' => '2026-02-15',
                'number_of_installments' => 12,
                'current_installment' => 1,
                'first_payment_date' => '2026-02-15',
                'last_payment_date' => '2027-01-15',
                'status' => 'pending',
            ],
            [
                'amount' => 300.00,
                'description' => 'Refrigerador',
                'category' => 'Electrodomésticos',
                'due_date' => '2026-02-10',
                'number_of_installments' => 6,
                'current_installment' => 1,
                'first_payment_date' => '2026-02-10',
                'last_payment_date' => '2026-07-10',
                'status' => 'pending',
            ],
            [
                'amount' => 200.00,
                'description' => 'Televisor',
                'category' => 'Electrónica',
                'due_date' => '2026-02-20',
                'number_of_installments' => 4,
                'current_installment' => 1,
                'first_payment_date' => '2026-02-20',
                'last_payment_date' => '2026-05-20',
                'status' => 'pending',
            ],
            [
                'amount' => 150.00,
                'description' => 'Bicicleta',
                'category' => 'Deportes',
                'due_date' => '2026-02-05',
                'number_of_installments' => 3,
                'current_installment' => 1,
                'first_payment_date' => '2026-02-05',
                'last_payment_date' => '2026-04-05',
                'status' => 'pending',
            ],
            [
                'amount' => 400.00,
                'description' => 'Muebles de sala',
                'category' => 'Muebles',
                'due_date' => '2026-02-25',
                'number_of_installments' => 8,
                'current_installment' => 1,
                'first_payment_date' => '2026-02-25',
                'last_payment_date' => '2026-09-25',
                'status' => 'pending',
            ],
        ];

        foreach ($installmentData as $installment) {
            Installment::create($installment);
        }
    }
}
