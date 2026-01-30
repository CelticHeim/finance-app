<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('installment_items', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2);
            $table->date('payment_date');
            $table->string('status')->default('pending');
            $table->foreignId('installment_id')->constrained('installments')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void {
        Schema::dropIfExists('installment_items');
    }
};
