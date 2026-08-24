<?php

namespace App\Models\PatchUpdates;

use App\Models\PatchUpdates\Base\SchoolBaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrepaidAccountTransaction extends SchoolBaseModel
{
    use HasFactory;

    protected $table = 'prepaid_account_transactions';

    protected $fillable = [
        'userid',
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
}