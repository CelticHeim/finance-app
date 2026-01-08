<?php

namespace Database\Seeders;

use App\Models\Fixed;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FixedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fixedData = [
            [
                'amount' => 1200.00,
                'category' => 'Alquiler',
                'description' => 'Alquiler apartamento',
                'day_of_month' => 1,
            ],
            [
                'amount' => 100.00,
                'category' => 'Internet',
                'description' => 'Servicio de internet',
                'day_of_month' => 5,
            ],
            [
                'amount' => 80.00,
                'category' => 'Teléfono',
                'description' => 'Plan de celular',
                'day_of_month' => 10,
            ],
            [
                'amount' => 50.00,
                'category' => 'Suscripción',
                'description' => 'Streaming mensual',
                'day_of_month' => 15,
            ],
            [
                'amount' => 150.00,
                'category' => 'Seguro',
                'description' => 'Seguro del coche',
                'day_of_month' => 20,
            ],
        ];

        foreach ($fixedData as $fixed) {
            Fixed::create($fixed);
        }
    }
}
