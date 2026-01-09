<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Installment extends Model {
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'description',
        'category',
        'due_date',
        'number_of_installments',
        'current_installment',
        // 'first_payment_date',
        // 'last_payment_date',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'number_of_installments' => 'integer',
        'current_installment' => 'integer',
        'due_date' => 'date',
        // 'first_payment_date' => 'date',
        // 'last_payment_date' => 'date',
    ];

    // Relations
    public function transactions() {
        return $this->morphMany(Transaction::class, 'transactionable');
    }
}
