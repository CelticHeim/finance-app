<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('installments', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->text('description');
            $table->string('category');
            $table->date('due_date');
            $table->tinyInteger('number_of_installments');
            $table->tinyInteger('current_installment')->default(1);
            // $table->date('first_payment_date');
            // $table->date('last_payment_date');
            $table->string('status')->default('pending'); // pending, paid, overdue
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('installments');
    }
};
