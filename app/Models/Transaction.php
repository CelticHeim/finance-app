<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model {
    protected $fillable = [
        'amount',
        'description',
        'discount',
        'transaction_date',
        'category',
        'type',
        'status',
        'transactionable_id',
        'transactionable_type',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'transaction_date' => 'datetime',
    ];

    // Relations
    public function transactionable() {
        return $this->morphTo();
    }
}
