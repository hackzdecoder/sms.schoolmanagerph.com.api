<?php

namespace App\Models\PatchUpdates;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreviousSyAccountBalance extends Model
{
    use HasFactory;

    protected $table = 'previous_sy_account_balance';
    
    protected $connection = 'users_main';

    protected $fillable = [
        'user_id',
        'school_code',
        'student_id',
        'student_name',
        'enrollment_number',
        'level',
        'section_course',
        'school_year',
        'school_term',
        'transaction_date',
        'original_amount',
        'paid_amount',
        'account_balance',
        'last_payment_date',
        'last_reference_number',
        'status',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'last_payment_date' => 'date',
        'original_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'account_balance' => 'decimal:2',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }   

    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeBySchoolYear($query, $schoolYear)
    {
        return $query->where('school_year', $schoolYear);
    }

    public function scopeByUserId($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}