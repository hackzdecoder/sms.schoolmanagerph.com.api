<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PrepaidAccountBalance;
use Carbon\Carbon;

class PrepaidAccountBalanceSeeder extends Seeder
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
                'prepaid_balance' => 5000.00,
                'last_reload_date' => '2026-08-05',
                'last_reference_number' => 'PRE-ATH-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09459759771',
                'school_code' => 'atheneum',
                'student_id' => '20260000002',
                'student_name' => 'Cipriaso, Mitch',
                'prepaid_balance' => 3000.00,
                'last_reload_date' => '2026-08-10',
                'last_reference_number' => 'PRE-ATH-002',
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
                'prepaid_balance' => 7500.00,
                'last_reload_date' => '2026-08-15',
                'last_reference_number' => 'PRE-SCA-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09165620305',
                'school_code' => 'sca',
                'student_id' => '20260000004',
                'student_name' => 'Navarra, Sheena',
                'prepaid_balance' => 2000.00,
                'last_reload_date' => '2026-08-20',
                'last_reference_number' => 'PRE-SCA-002',
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
                'prepaid_balance' => 8000.00,
                'last_reload_date' => '2026-08-08',
                'last_reference_number' => 'PRE-GVA-001',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'userid' => '09533786679',
                'school_code' => 'gva',
                'student_id' => '20260000006',
                'student_name' => 'Villaruel, Roxanne',
                'prepaid_balance' => 1500.00,
                'last_reload_date' => '2026-08-12',
                'last_reference_number' => 'PRE-GVA-002',
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
                'prepaid_balance' => 2500.00,
                'last_reload_date' => '2026-08-01',
                'last_reference_number' => 'PRE-GVA-003',
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
                'prepaid_balance' => 6000.00,
                'last_reload_date' => '2026-08-18',
                'last_reference_number' => 'PRE-GVA-004',
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
                'prepaid_balance' => 10000.00,
                'last_reload_date' => '2026-08-22',
                'last_reference_number' => 'PRE-GVA-005',
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
                'prepaid_balance' => 3500.00,
                'last_reload_date' => '2026-08-25',
                'last_reference_number' => 'PRE-GVA-006',
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
                'prepaid_balance' => 1800.00,
                'last_reload_date' => '2026-08-28',
                'last_reference_number' => 'PRE-GVA-007',
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
                'prepaid_balance' => 4500.00,
                'last_reload_date' => '2026-08-30',
                'last_reference_number' => 'PRE-GVA-008',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($records as $record) {
            PrepaidAccountBalance::create($record);
        }
    }
}