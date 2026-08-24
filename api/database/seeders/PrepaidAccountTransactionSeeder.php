<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PrepaidAccountTransaction;
use Carbon\Carbon;

class PrepaidAccountTransactionSeeder extends Seeder
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 1',
                'item_amount' => 150.00,
                'post_prepaid_balance' => 350.00,
                'transaction_date' => '2026-08-05 08:08:00',
                'transaction_reference' => 'TXN-ATH-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09459759771',
                'school_code' => 'atheneum',
                'student_id' => '20260000001',
                'student_name' => 'Cipriaso, Mitch',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'School Supplies',
                'item_amount' => 200.00,
                'post_prepaid_balance' => 150.00,
                'transaction_date' => '2026-08-06 09:15:00',
                'transaction_reference' => 'TXN-ATH-002',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09459759771',
                'school_code' => 'atheneum',
                'student_id' => '20260000002',
                'student_name' => 'Cipriaso, Mitch',
                'school_year' => '2026-2027',
                'school_term' => '2ND SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 2',
                'item_amount' => 160.00,
                'post_prepaid_balance' => 340.00,
                'transaction_date' => '2026-08-10 08:30:00',
                'transaction_reference' => 'TXN-ATH-003',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 1',
                'item_amount' => 150.00,
                'post_prepaid_balance' => 600.00,
                'transaction_date' => '2026-08-15 07:45:00',
                'transaction_reference' => 'TXN-SCA-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09165620305',
                'school_code' => 'sca',
                'student_id' => '20260000003',
                'student_name' => 'Navarra, Sheena',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Project Materials',
                'item_amount' => 250.00,
                'post_prepaid_balance' => 350.00,
                'transaction_date' => '2026-08-16 10:20:00',
                'transaction_reference' => 'TXN-SCA-002',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09165620305',
                'school_code' => 'sca',
                'student_id' => '20260000004',
                'student_name' => 'Navarra, Sheena',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 2',
                'item_amount' => 160.00,
                'post_prepaid_balance' => 540.00,
                'transaction_date' => '2026-08-20 08:00:00',
                'transaction_reference' => 'TXN-SCA-003',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 1',
                'item_amount' => 150.00,
                'post_prepaid_balance' => 850.00,
                'transaction_date' => '2026-08-08 08:15:00',
                'transaction_reference' => 'TXN-GVA-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09533786679',
                'school_code' => 'gva',
                'student_id' => '20260000005',
                'student_name' => 'Villaruel, Roxanne',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'School Supplies',
                'item_amount' => 200.00,
                'post_prepaid_balance' => 650.00,
                'transaction_date' => '2026-08-09 09:30:00',
                'transaction_reference' => 'TXN-GVA-002',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09533786679',
                'school_code' => 'gva',
                'student_id' => '20260000006',
                'student_name' => 'Villaruel, Roxanne',
                'school_year' => '2026-2027',
                'school_term' => '2ND SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 3',
                'item_amount' => 180.00,
                'post_prepaid_balance' => 320.00,
                'transaction_date' => '2026-08-12 07:50:00',
                'transaction_reference' => 'TXN-GVA-003',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 1',
                'item_amount' => 150.00,
                'post_prepaid_balance' => 350.00,
                'transaction_date' => '2026-08-01 08:00:00',
                'transaction_reference' => 'TXN-GVA-004',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09292784580',
                'school_code' => 'gva',
                'student_id' => '20260000007',
                'student_name' => 'Uy, Mary Ruth Joy',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Project Materials',
                'item_amount' => 300.00,
                'post_prepaid_balance' => 50.00,
                'transaction_date' => '2026-08-03 10:45:00',
                'transaction_reference' => 'TXN-GVA-005',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 2',
                'item_amount' => 160.00,
                'post_prepaid_balance' => 840.00,
                'transaction_date' => '2026-08-18 08:30:00',
                'transaction_reference' => 'TXN-GVA-006',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 1',
                'item_amount' => 150.00,
                'post_prepaid_balance' => 850.00,
                'transaction_date' => '2026-08-22 07:15:00',
                'transaction_reference' => 'TXN-GVA-007',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09953344438',
                'school_code' => 'gva',
                'student_id' => '20260000009',
                'student_name' => 'Delos Santos, Lilibeth',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'School Supplies',
                'item_amount' => 200.00,
                'post_prepaid_balance' => 650.00,
                'transaction_date' => '2026-08-23 09:00:00',
                'transaction_reference' => 'TXN-GVA-008',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 3',
                'item_amount' => 180.00,
                'post_prepaid_balance' => 320.00,
                'transaction_date' => '2026-08-25 08:45:00',
                'transaction_reference' => 'TXN-GVA-009',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 1',
                'item_amount' => 150.00,
                'post_prepaid_balance' => 150.00,
                'transaction_date' => '2026-08-28 08:00:00',
                'transaction_reference' => 'TXN-GVA-010',
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
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Student Meal 2',
                'item_amount' => 160.00,
                'post_prepaid_balance' => 340.00,
                'transaction_date' => '2026-08-30 08:15:00',
                'transaction_reference' => 'TXN-GVA-011',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09973947883',
                'school_code' => 'gva',
                'student_id' => '20260000012',
                'student_name' => 'Santos, Louie',
                'school_year' => '2026-2027',
                'school_term' => '1ST SEMESTER',
                'transaction_type' => 'Item Purchase',
                'item_description' => 'Project Materials',
                'item_amount' => 250.00,
                'post_prepaid_balance' => 90.00,
                'transaction_date' => '2026-08-31 10:00:00',
                'transaction_reference' => 'TXN-GVA-012',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($records as $record) {
            PrepaidAccountTransaction::create($record);
        }
    }
}