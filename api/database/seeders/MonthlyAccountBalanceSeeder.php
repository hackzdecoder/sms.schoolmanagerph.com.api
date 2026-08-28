<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\MonthlyAccountBalance;

class MonthlyAccountBalanceSeeder extends Seeder
{
    public function run()
    {
        MonthlyAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'enrollment_date' => '2026-06-01 08:00:00',
            'enrollment_number' => 'ENR-ATH-2026-001',
            'level' => 'Grade 5',
            'section_course' => 'Fleming',
            'school_year' => '2026-2027',
            'school_term' => '1ST SEMESTER',
            'payment_mode' => 'MONTHLY',
            
            // June 2026 - Paid
            'month_1_duedate' => '2026-06-30 23:59:00',
            'month_1_orig_amount' => '1000.00',
            'month_1_paid_amount' => '1000.00',
            'month_1_account_balance' => '0.00',
            'month_1_status' => 'paid',
            
            // July 2026 - Paid
            'month_2_duedate' => '2026-07-31 23:59:00',
            'month_2_orig_amount' => '1000.00',
            'month_2_paid_amount' => '1000.00',
            'month_2_account_balance' => '0.00',
            'month_2_status' => 'paid',
            
            // August 2026 - Partial (Due: Aug 31, 2026)
            'month_3_duedate' => '2026-08-31 23:59:00',
            'month_3_orig_amount' => '1000.00',
            'month_3_paid_amount' => '500.00',
            'month_3_account_balance' => '500.00',
            'month_3_status' => 'overdue', // Overdue because Aug 31 passed
            
            // September 2026 - Not Paid (Due: Sep 30, 2026)
            'month_4_duedate' => '2026-09-30 23:59:00',
            'month_4_orig_amount' => '1000.00',
            'month_4_paid_amount' => '0.00',
            'month_4_account_balance' => '1000.00',
            'month_4_status' => 'overdue',
            
            // October 2026 - Not Paid (Due: Oct 31, 2026)
            'month_5_duedate' => '2026-10-31 23:59:00',
            'month_5_orig_amount' => '1000.00',
            'month_5_paid_amount' => '0.00',
            'month_5_account_balance' => '1000.00',
            'month_5_status' => 'overdue',
            
            // November 2026 - Not Paid (Due: Nov 30, 2026)
            'month_6_duedate' => '2026-11-30 23:59:00',
            'month_6_orig_amount' => '1000.00',
            'month_6_paid_amount' => '0.00',
            'month_6_account_balance' => '1000.00',
            'month_6_status' => 'overdue', // Status is 'overdue' since it's now August and due date passed
            
            // December 2026 - Not Paid (Due: Dec 31, 2026)
            'month_7_duedate' => '2026-12-31 23:59:00',
            'month_7_orig_amount' => '1000.00',
            'month_7_paid_amount' => '0.00',
            'month_7_account_balance' => '1000.00',
            'month_7_status' => 'overdue',
            
            // January 2027 - Not Paid (Due: Jan 31, 2027)
            'month_8_duedate' => '2027-01-31 23:59:00',
            'month_8_orig_amount' => '1000.00',
            'month_8_paid_amount' => '0.00',
            'month_8_account_balance' => '1000.00',
            'month_8_status' => 'overdue',
            
            // February 2027 - Not Paid (Due: Feb 28, 2027)
            'month_9_duedate' => '2027-02-28 23:59:00',
            'month_9_orig_amount' => '1000.00',
            'month_9_paid_amount' => '0.00',
            'month_9_account_balance' => '1000.00',
            'month_9_status' => 'overdue',
            
            // March 2027 - Not Paid (Due: Mar 31, 2027)
            'month_10_duedate' => '2027-03-31 23:59:00',
            'month_10_orig_amount' => '1000.00',
            'month_10_paid_amount' => '0.00',
            'month_10_account_balance' => '1000.00',
            'month_10_status' => 'overdue',
            
            'status' => 'active',
        ]);
    }
}