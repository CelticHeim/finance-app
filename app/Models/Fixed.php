<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fixed extends Model {
    use SoftDeletes;

    protected $fillable = [
        'amount',
        'category',
        'description',
        'day_of_month',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];
}
