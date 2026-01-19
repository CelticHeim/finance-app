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

    protected $appends = ['final_amount'];

    // Accessors
    public function getFinalAmountAttribute() {
        $discount = $this->discount ? (float) $this->discount : 0;
        return round((float) $this->amount - $discount, 2);
    }

    // Relations
    public function transactionable() {
        return $this->morphTo();
    }

    // Scopes
    public function scopeByMonthAndYear($query, $month = null, $year = null) {
        if ($month) {
            $query->whereMonth('transaction_date', $month);
        }

        if ($year) {
            $query->whereYear('transaction_date', $year);
        }

        return $query;
    }

    public function scopeByType($query, $types = null) {
        if ($types) {
            $typeArray = array_map('trim', explode(',', $types));
            $query->whereIn('type', $typeArray);
        }

        return $query;
    }
}
