<?php

namespace App\Models\PatchUpdates;

use App\Models\PatchUpdates\Base\SchoolBaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentTransaction extends SchoolBaseModel
{
    use HasFactory;

    protected $table = 'payment_transactions';

    protected $fillable = [
        'user_id',
        'school_code',
        'student_id',
        'student_name',
        'level',
        'section_course',
        'school_year',
        'school_term',
        'payment_method',
        'payment_description',
        'payment_amount',
        'payment_date',
        'transaction_reference',
        'cashier',
        'status',
    ];

    protected $casts = [
        'payment_amount' => 'decimal:2',
        'payment_date' => 'datetime',
    ];
}