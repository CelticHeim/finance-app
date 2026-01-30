<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstallmentItem extends Model {
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'payment_date',
        'status',
        'installment_id',
    ];

    protected $casts = [
        'payment_date' => 'date',
    ];

    public function installment(): BelongsTo {
        return $this->belongsTo(Installment::class);
    }

    public function transaction() {
        return $this->hasOne(Transaction::class);
    }

    // Scopes
    public function scopeByMonthAndYear($query, $month = null, $year = null) {
        if ($month) {
            $query->whereMonth('payment_date', $month);
        }

        if ($year) {
            $query->whereYear('payment_date', $year);
        }

        return $query;
    }
}
