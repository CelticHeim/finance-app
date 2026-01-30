<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->text('description');
            $table->decimal('discount', 10, 2)->default(0);
            $table->dateTime('transaction_date')->nullable();
            $table->string('category');
            $table->string('type'); // 'income', 'expense', 'fixed', 'installment'
            $table->string('status')->default('pending'); // 'pending', 'completed', 'failed'
            $table->foreignId('installment_item_id')->nullable()->constrained('installment_items')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('transactions');
    }
};
