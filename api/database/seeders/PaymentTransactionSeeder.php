<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PaymentTransaction;

class PaymentTransactionSeeder extends Seeder
{
    public function run()
    {
        // Payment 1 - Tuition Down Payment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'Cash',
            'payment_description' => 'Tuition Fee - Down Payment',
            'payment_amount' => '3000.00',
            'payment_date' => '2026-06-01 08:30:00',
            'transaction_reference' => 'PAY-ATH-2026-001',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 2 - Books Payment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'GCash',
            'payment_description' => 'Learning Materials Payment',
            'payment_amount' => '1800.00',
            'payment_date' => '2026-06-20 10:30:00',
            'transaction_reference' => 'PAY-ATH-2026-002',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 3 - Uniform Payment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'Cash',
            'payment_description' => 'School Uniform Payment',
            'payment_amount' => '2000.00',
            'payment_date' => '2026-06-25 15:00:00',
            'transaction_reference' => 'PAY-ATH-2026-003',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 4 - Lab Fee Payment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'Cash',
            'payment_description' => 'Science Laboratory Fee',
            'payment_amount' => '700.00',
            'payment_date' => '2026-07-15 11:00:00',
            'transaction_reference' => 'PAY-ATH-2026-004',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 5 - June Installment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'Bank Transfer',
            'payment_description' => 'Monthly Installment - June',
            'payment_amount' => '1000.00',
            'payment_date' => '2026-06-30 14:00:00',
            'transaction_reference' => 'PAY-ATH-2026-005',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 6 - July Installment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'GCash',
            'payment_description' => 'Monthly Installment - July',
            'payment_amount' => '1000.00',
            'payment_date' => '2026-07-31 14:30:00',
            'transaction_reference' => 'PAY-ATH-2026-006',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 7 - August Partial Installment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'Cash',
            'payment_description' => 'Monthly Installment - August (Partial)',
            'payment_amount' => '500.00',
            'payment_date' => '2026-08-15 14:00:00',
            'transaction_reference' => 'PAY-ATH-2026-007',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);

        // Payment 8 - Field Trip Partial Payment
        PaymentTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_method' => 'Cash',
            'payment_description' => 'Field Trip - Partial Payment',
            'payment_amount' => '300.00',
            'payment_date' => '2026-08-12 13:00:00',
            'transaction_reference' => 'PAY-ATH-2026-008',
            'cashier' => 'Admin',
            'status' => 'active',
        ]);
    }
}