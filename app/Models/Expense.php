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
        'is_fixed',
        'is_installment',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'is_fixed' => 'boolean',
        'is_installment' => 'boolean',
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
