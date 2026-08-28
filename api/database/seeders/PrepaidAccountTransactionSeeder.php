<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PrepaidAccountTransaction;

class PrepaidAccountTransactionSeeder extends Seeder
{
    public function run()
    {
        // Reload 1
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Reload',
            'item_description' => 'Prepaid Balance Reload',
            'item_amount' => '2000.00',
            'post_prepaid_balance' => '2000.00',
            'transaction_date' => '2026-08-01 08:00:00',
            'transaction_reference' => 'PRE-ATH-2026-001',
            'status' => 'active',
        ]);

        // Transaction 1 - Canteen
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Canteen',
            'item_description' => 'Lunch Meal',
            'item_amount' => '120.00',
            'post_prepaid_balance' => '1880.00',
            'transaction_date' => '2026-08-02 12:15:00',
            'transaction_reference' => 'TXN-ATH-PRE-001',
            'status' => 'active',
        ]);

        // Transaction 2 - School Supplies
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Supplies',
            'item_description' => 'Art Materials and Notebooks',
            'item_amount' => '180.00',
            'post_prepaid_balance' => '1700.00',
            'transaction_date' => '2026-08-04 09:30:00',
            'transaction_reference' => 'TXN-ATH-PRE-002',
            'status' => 'active',
        ]);

        // Transaction 3 - Canteen
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Canteen',
            'item_description' => 'Lunch Meal and Drink',
            'item_amount' => '130.00',
            'post_prepaid_balance' => '1570.00',
            'transaction_date' => '2026-08-05 12:00:00',
            'transaction_reference' => 'TXN-ATH-PRE-003',
            'status' => 'active',
        ]);

        // Reload 2
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Reload',
            'item_description' => 'Additional Balance Reload',
            'item_amount' => '500.00',
            'post_prepaid_balance' => '2070.00',
            'transaction_date' => '2026-08-10 08:30:00',
            'transaction_reference' => 'PRE-ATH-2026-002',
            'status' => 'active',
        ]);

        // Transaction 4 - Printing
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Printing',
            'item_description' => 'Research Materials Printing',
            'item_amount' => '100.00',
            'post_prepaid_balance' => '1970.00',
            'transaction_date' => '2026-08-11 09:00:00',
            'transaction_reference' => 'TXN-ATH-PRE-004',
            'status' => 'active',
        ]);

        // Transaction 5 - Canteen
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Canteen',
            'item_description' => 'Snacks',
            'item_amount' => '60.00',
            'post_prepaid_balance' => '1910.00',
            'transaction_date' => '2026-08-12 15:30:00',
            'transaction_reference' => 'TXN-ATH-PRE-005',
            'status' => 'active',
        ]);

        // Transaction 6 - Photocopy
        PrepaidAccountTransaction::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'transaction_type' => 'Photocopy',
            'item_description' => 'Worksheet Photocopy',
            'item_amount' => '160.00',
            'post_prepaid_balance' => '1750.00',
            'transaction_date' => '2026-08-13 10:00:00',
            'transaction_reference' => 'TXN-ATH-PRE-006',
            'status' => 'active',
        ]);
    }
}