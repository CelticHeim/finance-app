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
        'due_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    // Relations
    public function transactions() {
        return $this->morphMany(Transaction::class, 'transactionable');
    }
}
