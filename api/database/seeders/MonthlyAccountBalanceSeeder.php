<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\MonthlyAccountBalance;
use Carbon\Carbon;

class MonthlyAccountBalanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            // ============================================================
            // ATHENEUM - Mitch Cipriaso (09459759771)
            // ============================================================
            [
                'userid' => '09459759771',
                'school_code' => 'atheneum',
                'student_id' => '20260000001',
                'student_name' => 'Cipriaso, Mitch',
                'enrollment_date' => '2026-05-05',
                'enrollment_number' => 'ENR-ATH-001',
                'level' => 'GRADE 7',
                'section_course' => 'ATHENEUM',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-05',
                'month_1_orig_amount' => 1000.00,
                'month_1_paid_amount' => 1000.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Overdue
                'month_2_duedate' => '2026-08-05',
                'month_2_orig_amount' => 1000.00,
                'month_2_paid_amount' => 100.00,
                'month_2_account_balance' => 900.00,
                'month_2_status' => 'overdue',
                // Month 3 - Overdue
                'month_3_duedate' => '2026-09-05',
                'month_3_orig_amount' => 1000.00,
                'month_3_paid_amount' => 0.00,
                'month_3_account_balance' => 1000.00,
                'month_3_status' => 'overdue',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-05',
                'month_4_orig_amount' => 1000.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 1000.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-05',
                'month_5_orig_amount' => 1000.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1000.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-05',
                'month_6_orig_amount' => 1000.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1000.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-05',
                'month_7_orig_amount' => 1000.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1000.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-05',
                'month_8_orig_amount' => 1000.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1000.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-05',
                'month_9_orig_amount' => 1000.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1000.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-05',
                'month_10_orig_amount' => 1000.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1000.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // SCA - Sheena Navarra (09165620305)
            // ============================================================
            [
                'userid' => '09165620305',
                'school_code' => 'sca',
                'student_id' => '20260000003',
                'student_name' => 'Navarra, Sheena',
                'enrollment_date' => '2026-05-07',
                'enrollment_number' => 'ENR-SCA-001',
                'level' => 'GRADE 7',
                'section_course' => 'SCA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-07',
                'month_1_orig_amount' => 1100.00,
                'month_1_paid_amount' => 1100.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Paid
                'month_2_duedate' => '2026-08-07',
                'month_2_orig_amount' => 1100.00,
                'month_2_paid_amount' => 1100.00,
                'month_2_account_balance' => 0.00,
                'month_2_status' => 'paid',
                // Month 3 - Paid
                'month_3_duedate' => '2026-09-07',
                'month_3_orig_amount' => 1100.00,
                'month_3_paid_amount' => 1100.00,
                'month_3_account_balance' => 0.00,
                'month_3_status' => 'paid',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-07',
                'month_4_orig_amount' => 1100.00,
                'month_4_paid_amount' => 200.00,
                'month_4_account_balance' => 900.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-07',
                'month_5_orig_amount' => 1100.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1100.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-07',
                'month_6_orig_amount' => 1100.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1100.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-07',
                'month_7_orig_amount' => 1100.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1100.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-07',
                'month_8_orig_amount' => 1100.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1100.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-07',
                'month_9_orig_amount' => 1100.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1100.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-07',
                'month_10_orig_amount' => 1100.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1100.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Roxanne Villaruel (09533786679)
            // ============================================================
            [
                'userid' => '09533786679',
                'school_code' => 'gva',
                'student_id' => '20260000005',
                'student_name' => 'Villaruel, Roxanne',
                'enrollment_date' => '2026-05-09',
                'enrollment_number' => 'ENR-GVA-001',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-09',
                'month_1_orig_amount' => 1000.00,
                'month_1_paid_amount' => 1000.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Paid
                'month_2_duedate' => '2026-08-09',
                'month_2_orig_amount' => 1000.00,
                'month_2_paid_amount' => 1000.00,
                'month_2_account_balance' => 0.00,
                'month_2_status' => 'paid',
                // Month 3 - Overdue
                'month_3_duedate' => '2026-09-09',
                'month_3_orig_amount' => 1000.00,
                'month_3_paid_amount' => 200.00,
                'month_3_account_balance' => 800.00,
                'month_3_status' => 'overdue',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-09',
                'month_4_orig_amount' => 1000.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 1000.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-09',
                'month_5_orig_amount' => 1000.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1000.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-09',
                'month_6_orig_amount' => 1000.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1000.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-09',
                'month_7_orig_amount' => 1000.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1000.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-09',
                'month_8_orig_amount' => 1000.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1000.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-09',
                'month_9_orig_amount' => 1000.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1000.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-09',
                'month_10_orig_amount' => 1000.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1000.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Mary Ruth Joy Uy (09292784580)
            // ============================================================
            [
                'userid' => '09292784580',
                'school_code' => 'gva',
                'student_id' => '20260000007',
                'student_name' => 'Uy, Mary Ruth Joy',
                'enrollment_date' => '2026-05-11',
                'enrollment_number' => 'ENR-GVA-003',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Overdue
                'month_1_duedate' => '2026-07-11',
                'month_1_orig_amount' => 960.00,
                'month_1_paid_amount' => 0.00,
                'month_1_account_balance' => 960.00,
                'month_1_status' => 'overdue',
                // Month 2 - Overdue
                'month_2_duedate' => '2026-08-11',
                'month_2_orig_amount' => 960.00,
                'month_2_paid_amount' => 0.00,
                'month_2_account_balance' => 960.00,
                'month_2_status' => 'overdue',
                // Month 3 - Overdue
                'month_3_duedate' => '2026-09-11',
                'month_3_orig_amount' => 960.00,
                'month_3_paid_amount' => 0.00,
                'month_3_account_balance' => 960.00,
                'month_3_status' => 'overdue',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-11',
                'month_4_orig_amount' => 960.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 960.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-11',
                'month_5_orig_amount' => 960.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 960.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-11',
                'month_6_orig_amount' => 960.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 960.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-11',
                'month_7_orig_amount' => 960.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 960.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-11',
                'month_8_orig_amount' => 960.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 960.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-11',
                'month_9_orig_amount' => 960.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 960.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-11',
                'month_10_orig_amount' => 960.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 960.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Alma Villota Dulay (09484131577)
            // ============================================================
            [
                'userid' => '09484131577',
                'school_code' => 'gva',
                'student_id' => '20260000008',
                'student_name' => 'Dulay, Alma Villota',
                'enrollment_date' => '2026-05-12',
                'enrollment_number' => 'ENR-GVA-004',
                'level' => 'GRADE 9',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-12',
                'month_1_orig_amount' => 1200.00,
                'month_1_paid_amount' => 1200.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Overdue
                'month_2_duedate' => '2026-08-12',
                'month_2_orig_amount' => 1200.00,
                'month_2_paid_amount' => 700.00,
                'month_2_account_balance' => 500.00,
                'month_2_status' => 'overdue',
                // Month 3 - Overdue
                'month_3_duedate' => '2026-09-12',
                'month_3_orig_amount' => 1200.00,
                'month_3_paid_amount' => 0.00,
                'month_3_account_balance' => 1200.00,
                'month_3_status' => 'overdue',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-12',
                'month_4_orig_amount' => 1200.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 1200.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-12',
                'month_5_orig_amount' => 1200.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1200.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-12',
                'month_6_orig_amount' => 1200.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1200.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-12',
                'month_7_orig_amount' => 1200.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1200.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-12',
                'month_8_orig_amount' => 1200.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1200.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-12',
                'month_9_orig_amount' => 1200.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1200.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-12',
                'month_10_orig_amount' => 1200.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1200.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Lilibeth Delos Santos (09953344438)
            // ============================================================
            [
                'userid' => '09953344438',
                'school_code' => 'gva',
                'student_id' => '20260000009',
                'student_name' => 'Delos Santos, Lilibeth',
                'enrollment_date' => '2026-05-13',
                'enrollment_number' => 'ENR-GVA-005',
                'level' => 'GRADE 10',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-13',
                'month_1_orig_amount' => 1300.00,
                'month_1_paid_amount' => 1300.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Paid
                'month_2_duedate' => '2026-08-13',
                'month_2_orig_amount' => 1300.00,
                'month_2_paid_amount' => 1300.00,
                'month_2_account_balance' => 0.00,
                'month_2_status' => 'paid',
                // Month 3 - Paid
                'month_3_duedate' => '2026-09-13',
                'month_3_orig_amount' => 1300.00,
                'month_3_paid_amount' => 1300.00,
                'month_3_account_balance' => 0.00,
                'month_3_status' => 'paid',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-13',
                'month_4_orig_amount' => 1300.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 1300.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-13',
                'month_5_orig_amount' => 1300.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1300.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-13',
                'month_6_orig_amount' => 1300.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1300.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-13',
                'month_7_orig_amount' => 1300.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1300.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-13',
                'month_8_orig_amount' => 1300.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1300.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-13',
                'month_9_orig_amount' => 1300.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1300.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-13',
                'month_10_orig_amount' => 1300.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1300.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Aileen Bonavente (09067850846)
            // ============================================================
            [
                'userid' => '09067850846',
                'school_code' => 'gva',
                'student_id' => '20260000010',
                'student_name' => 'Bonavente, Aileen',
                'enrollment_date' => '2026-05-14',
                'enrollment_number' => 'ENR-GVA-006',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-14',
                'month_1_orig_amount' => 1000.00,
                'month_1_paid_amount' => 1000.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Overdue
                'month_2_duedate' => '2026-08-14',
                'month_2_orig_amount' => 1000.00,
                'month_2_paid_amount' => 500.00,
                'month_2_account_balance' => 500.00,
                'month_2_status' => 'overdue',
                // Month 3 - Overdue
                'month_3_duedate' => '2026-09-14',
                'month_3_orig_amount' => 1000.00,
                'month_3_paid_amount' => 0.00,
                'month_3_account_balance' => 1000.00,
                'month_3_status' => 'overdue',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-14',
                'month_4_orig_amount' => 1000.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 1000.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-14',
                'month_5_orig_amount' => 1000.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1000.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-14',
                'month_6_orig_amount' => 1000.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1000.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-14',
                'month_7_orig_amount' => 1000.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1000.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-14',
                'month_8_orig_amount' => 1000.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1000.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-14',
                'month_9_orig_amount' => 1000.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1000.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-14',
                'month_10_orig_amount' => 1000.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1000.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Giezzelle Del Rosario (09052223875)
            // ============================================================
            [
                'userid' => '09052223875',
                'school_code' => 'gva',
                'student_id' => '20260000011',
                'student_name' => 'Del Rosario, Giezzelle C.',
                'enrollment_date' => '2026-05-15',
                'enrollment_number' => 'ENR-GVA-007',
                'level' => 'GRADE 8',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Overdue
                'month_1_duedate' => '2026-07-15',
                'month_1_orig_amount' => 1100.00,
                'month_1_paid_amount' => 200.00,
                'month_1_account_balance' => 900.00,
                'month_1_status' => 'overdue',
                // Month 2 - Overdue
                'month_2_duedate' => '2026-08-15',
                'month_2_orig_amount' => 1100.00,
                'month_2_paid_amount' => 0.00,
                'month_2_account_balance' => 1100.00,
                'month_2_status' => 'overdue',
                // Month 3 - Overdue
                'month_3_duedate' => '2026-09-15',
                'month_3_orig_amount' => 1100.00,
                'month_3_paid_amount' => 0.00,
                'month_3_account_balance' => 1100.00,
                'month_3_status' => 'overdue',
                // Month 4 - Overdue
                'month_4_duedate' => '2026-10-15',
                'month_4_orig_amount' => 1100.00,
                'month_4_paid_amount' => 0.00,
                'month_4_account_balance' => 1100.00,
                'month_4_status' => 'overdue',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-15',
                'month_5_orig_amount' => 1100.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1100.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-15',
                'month_6_orig_amount' => 1100.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1100.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-15',
                'month_7_orig_amount' => 1100.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1100.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-15',
                'month_8_orig_amount' => 1100.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1100.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-15',
                'month_9_orig_amount' => 1100.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1100.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-15',
                'month_10_orig_amount' => 1100.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1100.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ============================================================
            // GVA - Louie Santos (09973947883)
            // ============================================================
            [
                'userid' => '09973947883',
                'school_code' => 'gva',
                'student_id' => '20260000012',
                'student_name' => 'Santos, Louie',
                'enrollment_date' => '2026-05-16',
                'enrollment_number' => 'ENR-GVA-008',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'payment_mode' => 'MONTHLY',
                // Month 1 - Paid
                'month_1_duedate' => '2026-07-16',
                'month_1_orig_amount' => 1000.00,
                'month_1_paid_amount' => 1000.00,
                'month_1_account_balance' => 0.00,
                'month_1_status' => 'paid',
                // Month 2 - Paid
                'month_2_duedate' => '2026-08-16',
                'month_2_orig_amount' => 1000.00,
                'month_2_paid_amount' => 1000.00,
                'month_2_account_balance' => 0.00,
                'month_2_status' => 'paid',
                // Month 3 - Paid
                'month_3_duedate' => '2026-09-16',
                'month_3_orig_amount' => 1000.00,
                'month_3_paid_amount' => 1000.00,
                'month_3_account_balance' => 0.00,
                'month_3_status' => 'paid',
                // Month 4 - Paid
                'month_4_duedate' => '2026-10-16',
                'month_4_orig_amount' => 1000.00,
                'month_4_paid_amount' => 1000.00,
                'month_4_account_balance' => 0.00,
                'month_4_status' => 'paid',
                // Month 5 - Overdue
                'month_5_duedate' => '2026-11-16',
                'month_5_orig_amount' => 1000.00,
                'month_5_paid_amount' => 0.00,
                'month_5_account_balance' => 1000.00,
                'month_5_status' => 'overdue',
                // Month 6 - Overdue
                'month_6_duedate' => '2026-12-16',
                'month_6_orig_amount' => 1000.00,
                'month_6_paid_amount' => 0.00,
                'month_6_account_balance' => 1000.00,
                'month_6_status' => 'overdue',
                // Month 7 - Overdue
                'month_7_duedate' => '2027-01-16',
                'month_7_orig_amount' => 1000.00,
                'month_7_paid_amount' => 0.00,
                'month_7_account_balance' => 1000.00,
                'month_7_status' => 'overdue',
                // Month 8 - Overdue
                'month_8_duedate' => '2027-02-16',
                'month_8_orig_amount' => 1000.00,
                'month_8_paid_amount' => 0.00,
                'month_8_account_balance' => 1000.00,
                'month_8_status' => 'overdue',
                // Month 9 - Overdue
                'month_9_duedate' => '2027-03-16',
                'month_9_orig_amount' => 1000.00,
                'month_9_paid_amount' => 0.00,
                'month_9_account_balance' => 1000.00,
                'month_9_status' => 'overdue',
                // Month 10 - Overdue
                'month_10_duedate' => '2027-01-16',
                'month_10_orig_amount' => 1000.00,
                'month_10_paid_amount' => 0.00,
                'month_10_account_balance' => 1000.00,
                'month_10_status' => 'overdue',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($records as $record) {
            MonthlyAccountBalance::create($record);
        }
    }
}