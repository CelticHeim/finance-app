<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Installment extends Model {
    use SoftDeletes;

    protected $fillable = [
        'expense_id',
        'total_installments',
        'current_installment',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'total_installments' => 'integer',
        'current_installment' => 'integer',
    ];

    protected $dates = [
        'due_date',
    ];

    /**
     * Get the expense that owns this installment.
     */
    public function expense(): BelongsTo {
        return $this->belongsTo(Expense::class);
    }
}
