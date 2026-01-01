<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Income extends Model {
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'category',
        'description',
        'entry_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'entry_date' => 'date',
    ];

    protected $dates = [
        'entry_date',
    ];
}
