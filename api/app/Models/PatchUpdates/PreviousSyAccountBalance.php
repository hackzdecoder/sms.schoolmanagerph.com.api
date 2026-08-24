<?php

namespace App\Models\PatchUpdates;

use App\Models\PatchUpdates\Base\SchoolBaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PreviousSyAccountBalance extends SchoolBaseModel
{
    use HasFactory;

    protected $table = 'previous_sy_account_balance';

    protected $fillable = [
        'userid',
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
}