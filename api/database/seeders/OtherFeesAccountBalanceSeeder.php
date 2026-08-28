<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\OtherFeesAccountBalance;

class OtherFeesAccountBalanceSeeder extends Seeder
{
    public function run()
    {
        // Books - Has Balance
        OtherFeesAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2026-06-15 09:00:00',
            'fee_name' => 'Grade 5 Learning Materials',
            'orig_amount' => '2500.00',
            'discount' => '200.00',
            'paid_amount' => '1800.00',
            'account_balance' => '500.00',
            'last_payment_date' => '2026-07-20 10:30:00',
            'last_reference_number' => 'SI-ATH-BOOK-001',
            'status' => 'active',
        ]);

        // School Uniform - Fully Paid
        OtherFeesAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2026-06-20 10:00:00',
            'fee_name' => 'School Uniform Set',
            'orig_amount' => '2000.00',
            'discount' => '0.00',
            'paid_amount' => '2000.00',
            'account_balance' => '0.00',
            'last_payment_date' => '2026-06-25 15:00:00',
            'last_reference_number' => 'SI-ATH-UNIFORM-001',
            'status' => 'active',
        ]);

        // Science Laboratory - Has Balance
        OtherFeesAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2026-07-01 08:30:00',
            'fee_name' => 'Science Laboratory Fee',
            'orig_amount' => '1200.00',
            'discount' => '0.00',
            'paid_amount' => '700.00',
            'account_balance' => '500.00',
            'last_payment_date' => '2026-07-15 11:00:00',
            'last_reference_number' => 'SI-ATH-LAB-001',
            'status' => 'active',
        ]);

        // Sports Fee - Not Paid
        OtherFeesAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2026-08-01 13:00:00',
            'fee_name' => 'Sports and Athletic Fee',
            'orig_amount' => '600.00',
            'discount' => '0.00',
            'paid_amount' => '0.00',
            'account_balance' => '600.00',
            'last_payment_date' => null,
            'last_reference_number' => 'SI-ATH-SPORT-001',
            'status' => 'active',
        ]);

        // Field Trip - Has Balance
        OtherFeesAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_date' => '2026-08-10 09:00:00',
            'fee_name' => 'Educational Field Trip',
            'orig_amount' => '800.00',
            'discount' => '0.00',
            'paid_amount' => '300.00',
            'account_balance' => '500.00',
            'last_payment_date' => '2026-08-12 13:00:00',
            'last_reference_number' => 'SI-ATH-FIELD-001',
            'status' => 'active',
        ]);
    }
}