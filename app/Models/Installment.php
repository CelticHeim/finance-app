<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Installment extends Model {
    use SoftDeletes;

    protected $fillable = [
        'due_date',
        'amount',
        'number_of_installments',
        'current_installment',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'number_of_installments' => 'integer',
        'current_installment' => 'integer',
    ];

    protected $dates = [
        'due_date',
    ];
}
