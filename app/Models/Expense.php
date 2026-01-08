<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model {
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'discount',
        'category',
        'description',
        'expense_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'expense_date' => 'date',
    ];

    protected $dates = [
        'expense_date',
    ];

    /**
     * Get the installments for this expense.
     */
    public function installments(): HasMany {
        return $this->hasMany(Installment::class);
    }
}
