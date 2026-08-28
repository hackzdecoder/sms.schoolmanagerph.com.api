<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatchUpdates\PrepaidAccountBalance;

class PrepaidAccountBalanceSeeder extends Seeder
{
    public function run()
    {
        PrepaidAccountBalance::create([
            'user_id' => '09459759771',
            'school_code' => 'atheneum',
            'student_id' => '26050000080',
            'student_name' => 'Cipriaso, Mitch',
            'prepaid_balance' => '1750.00',
            'last_reload_date' => '2026-08-10 08:30:00',
            'last_reference_number' => 'PRE-ATH-2026-002',
            'status' => 'active',
        ]);
    }
}