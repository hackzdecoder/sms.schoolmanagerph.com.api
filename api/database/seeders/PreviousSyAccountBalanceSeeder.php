<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PreviousSyAccountBalance;
use Carbon\Carbon;

class PreviousSyAccountBalanceSeeder extends Seeder
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
                'enrollment_number' => '2606-10001',
                'level' => 'GRADE 7',
                'section_course' => 'ATHENEUM',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-01',
                'original_amount' => 5000.00,
                'paid_amount' => 2000.00,
                'account_balance' => 3000.00,
                'last_payment_date' => '2026-08-05',
                'last_reference_number' => 'SI-ATH-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09459759771',
                'school_code' => 'atheneum',
                'student_id' => '20260000002',
                'student_name' => 'Cipriaso, Mitch',
                'enrollment_number' => '2606-10002',
                'level' => 'GRADE 8',
                'section_course' => 'ATHENEUM',
                'school_year' => '2026-2027',
                'school_term' => '2ND SEMESTER',
                'transaction_date' => '2026-08-02',
                'original_amount' => 4500.00,
                'paid_amount' => 0.00,
                'account_balance' => 4500.00,
                'last_payment_date' => null,
                'last_reference_number' => null,
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
                'enrollment_number' => '2606-10003',
                'level' => 'GRADE 7',
                'section_course' => 'SCA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-03',
                'original_amount' => 5500.00,
                'paid_amount' => 5500.00,
                'account_balance' => 0.00,
                'last_payment_date' => '2026-08-10',
                'last_reference_number' => 'SI-SCA-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09165620305',
                'school_code' => 'sca',
                'student_id' => '20260000004',
                'student_name' => 'Navarra, Sheena',
                'enrollment_number' => '2606-10004',
                'level' => 'GRADE 8',
                'section_course' => 'SCA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-04',
                'original_amount' => 6000.00,
                'paid_amount' => 3000.00,
                'account_balance' => 3000.00,
                'last_payment_date' => '2026-08-12',
                'last_reference_number' => 'SI-SCA-002',
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
                'enrollment_number' => '2606-10005',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-05',
                'original_amount' => 5000.00,
                'paid_amount' => 5000.00,
                'account_balance' => 0.00,
                'last_payment_date' => '2026-08-15',
                'last_reference_number' => 'SI-GVA-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09533786679',
                'school_code' => 'gva',
                'student_id' => '20260000006',
                'student_name' => 'Villaruel, Roxanne',
                'enrollment_number' => '2606-10006',
                'level' => 'GRADE 8',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '2ND SEMESTER',
                'transaction_date' => '2026-08-06',
                'original_amount' => 5200.00,
                'paid_amount' => 2000.00,
                'account_balance' => 3200.00,
                'last_payment_date' => '2026-08-18',
                'last_reference_number' => 'SI-GVA-002',
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
                'enrollment_number' => '2606-10007',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-07',
                'original_amount' => 4800.00,
                'paid_amount' => 0.00,
                'account_balance' => 4800.00,
                'last_payment_date' => null,
                'last_reference_number' => null,
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
                'enrollment_number' => '2606-10008',
                'level' => 'GRADE 9',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-08',
                'original_amount' => 6000.00,
                'paid_amount' => 3500.00,
                'account_balance' => 2500.00,
                'last_payment_date' => '2026-08-20',
                'last_reference_number' => 'SI-GVA-003',
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
                'enrollment_number' => '2606-10009',
                'level' => 'GRADE 10',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-09',
                'original_amount' => 6500.00,
                'paid_amount' => 6500.00,
                'account_balance' => 0.00,
                'last_payment_date' => '2026-08-22',
                'last_reference_number' => 'SI-GVA-004',
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
                'enrollment_number' => '2606-10010',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-10',
                'original_amount' => 5000.00,
                'paid_amount' => 2500.00,
                'account_balance' => 2500.00,
                'last_payment_date' => '2026-08-25',
                'last_reference_number' => 'SI-GVA-005',
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
                'enrollment_number' => '2606-10011',
                'level' => 'GRADE 8',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-11',
                'original_amount' => 5500.00,
                'paid_amount' => 1000.00,
                'account_balance' => 4500.00,
                'last_payment_date' => '2026-08-28',
                'last_reference_number' => 'SI-GVA-006',
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
                'enrollment_number' => '2606-10012',
                'level' => 'GRADE 7',
                'section_course' => 'GVA',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_date' => '2026-08-12',
                'original_amount' => 5000.00,
                'paid_amount' => 5000.00,
                'account_balance' => 0.00,
                'last_payment_date' => '2026-08-30',
                'last_reference_number' => 'SI-GVA-007',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($records as $record) {
            PreviousSyAccountBalance::create($record);
        }
    }
}