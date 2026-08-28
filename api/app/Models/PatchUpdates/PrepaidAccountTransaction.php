<?php

namespace App\Models\PatchUpdates;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrepaidAccountTransaction extends Model
{
    use HasFactory;

    protected $table = 'prepaid_account_transactions';
    
    protected $connection = 'users_main';

    protected $fillable = [
        'user_id',
        'school_code',
        'student_id',
        'student_name',
        'school_year',
        'school_term',
        'transaction_type',
        'item_description',
        'item_amount',
        'post_prepaid_balance',
        'transaction_date',
        'transaction_reference',
        'status',
    ];

    protected $casts = [
        'item_amount' => 'decimal:2',
        'post_prepaid_balance' => 'decimal:2',
        'transaction_date' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeByUserId($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}