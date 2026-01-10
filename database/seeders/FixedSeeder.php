<?php

namespace Database\Seeders;

use App\Models\Fixed;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FixedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now(); // January 10, 2026
        
        $fixedData = [
            [
                'amount' => 1200.00,
                'category' => 'Alquiler',
                'description' => 'Alquiler apartamento',
                'due_date' => $now->clone()->setDay(1),
            ],
            [
                'amount' => 100.00,
                'category' => 'Internet',
                'description' => 'Servicio de internet',
                'due_date' => $now->clone()->setDay(5),
            ],
            [
                'amount' => 80.00,
                'category' => 'Teléfono',
                'description' => 'Plan de celular',
                'due_date' => $now->clone()->setDay(10),
            ],
            [
                'amount' => 50.00,
                'category' => 'Suscripción',
                'description' => 'Streaming mensual',
                'due_date' => $now->clone()->setDay(15),
            ],
            [
                'amount' => 150.00,
                'category' => 'Seguro',
                'description' => 'Seguro del coche',
                'due_date' => $now->clone()->setDay(20),
            ],
        ];

        foreach ($fixedData as $fixed) {
            Fixed::create($fixed);
        }
    }
}
