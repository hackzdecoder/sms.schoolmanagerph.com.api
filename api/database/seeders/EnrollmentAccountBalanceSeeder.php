<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\EnrollmentAccountBalance;

class EnrollmentAccountBalanceSeeder extends Seeder
{
    public function run()
    {
        // Current School Year 2026-2027 - Grade 5 (Current Enrollment)
        EnrollmentAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'enrollment_number' => 'ENR-ATH-2026-001',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2026-06-01 08:00:00',
            'original_amount' => '12000.00',
            'paid_amount' => '4500.00',
            'account_balance' => '7500.00', // Current Enrollment Fee Balance
            'last_payment_date' => '2026-08-15 14:00:00',
            'last_reference_number' => 'PAY-ATH-2026-003',
            'status' => 'active',
        ]);
    }
}