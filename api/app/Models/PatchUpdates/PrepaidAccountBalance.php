<?php

namespace App\Models\PatchUpdates;

use App\Models\PatchUpdates\Base\SchoolBaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrepaidAccountBalance extends SchoolBaseModel
{
    use HasFactory;

    protected $table = 'prepaid_account_balance';

    protected $fillable = [
        'userid',
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
}