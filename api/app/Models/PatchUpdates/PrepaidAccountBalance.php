<?php

namespace App\Models\PatchUpdates;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrepaidAccountBalance extends Model
{
    use HasFactory;

    protected $table = 'prepaid_account_balance';
    
    protected $connection = 'users_main';

    protected $fillable = [
        'user_id',
        'school_code',
        'student_id',
        'student_name',
        'prepaid_balance',
        'last_reload_date',
        'last_reference_number',
        'status',
    ];

    protected $casts = [
        'prepaid_balance' => 'decimal:2',
        'last_reload_date' => 'date',
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