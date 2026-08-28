<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PreviousSyAccountBalance;

class PreviousSyAccountBalanceSeeder extends Seeder
{
    public function run()
    {
        // School Year 2023-2024 - Grade 3 (Fully Paid)
        PreviousSyAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'enrollment_number' => 'ENR-ATH-2023-001',
            'level' => 'Grade 3',
            'section_course' => 'Fleming',
            'school_year' => '2023-2024',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2023-06-10 08:00:00',
            'original_amount' => '6500.00',
            'paid_amount' => '6500.00',
            'account_balance' => '0.00',
            'last_payment_date' => '2023-10-15 14:30:00',
            'last_reference_number' => 'PAY-ATH-2023-001',
            'status' => 'active',
        ]);

        // School Year 2024-2025 - Grade 4 (Has Balance)
        PreviousSyAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'enrollment_number' => 'ENR-ATH-2024-001',
            'level' => 'Grade 4',
            'section_course' => 'Fleming',
            'school_year' => '2024-2025',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2024-06-05 08:30:00',
            'original_amount' => '7500.00',
            'paid_amount' => '7000.00',
            'account_balance' => '500.00', // This will appear in Previous Account Balance
            'last_payment_date' => '2024-10-20 15:00:00',
            'last_reference_number' => 'PAY-ATH-2024-001',
            'status' => 'active',
        ]);

        // School Year 2025-2026 - Grade 4 (Has Balance)
        PreviousSyAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'enrollment_number' => 'ENR-ATH-2025-001',
            'level' => 'Grade 4',
            'section_course' => 'Fleming',
            'school_year' => '2025-2026',
            'school_term' => '2ND SEMESTER',
            'transaction_date' => '2025-11-05 09:30:00',
            'original_amount' => '7500.00',
            'paid_amount' => '7000.00',
            'account_balance' => '500.00', // This will appear in Previous Account Balance
            'last_payment_date' => '2026-03-01 10:00:00',
            'last_reference_number' => 'PAY-ATH-2025-001',
            'status' => 'active',
        ]);
    }
}