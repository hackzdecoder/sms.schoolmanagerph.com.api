<?php

namespace App\Http\Controllers\api\account_ledger;

use App\Http\Controllers\Controller;
use App\Helpers\DatabaseManager;
use App\Models\PatchUpdates\PreviousSyAccountBalance;
use App\Models\PatchUpdates\EnrollmentAccountBalance;
use App\Models\PatchUpdates\MonthlyAccountBalance;
use App\Models\PatchUpdates\OtherFeesAccountBalance;
use App\Models\PatchUpdates\PrepaidAccountBalance;
use App\Models\PatchUpdates\PrepaidAccountTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AccountLedgerController extends Controller
{
    public function details(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            // Get user_id from user object
            $userId = $user->user_id ?? null;
            if (!$userId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'User ID not found.'
                ], 400);
            }

            // Get school_code from user object
            $schoolCode = $user->school_code ?? null;
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found.'
                ], 400);
            }
            $schoolCode = strtolower($schoolCode);

            // Connect to school database
            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get student_id from student_records using school_code and user_id
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('school_code', $schoolCode)
                ->where('user_id', $userId)
                ->first();

            if (!$studentRecord) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student record not found for user_id: ' . $userId
                ], 400);
            }

            $studentId = $studentRecord->student_id;

            // Get student details from student_records
            $student = DB::connection($databaseName)
                ->table('student_records')
                ->where('student_id', $studentId)
                ->first();

            // Get address from student_id_info table in IDRS database
            $idrsDatabase = env('DB_SCHOOLS_DATABASE_DEV', 'idrs_school_db');
            $studentIdInfo = DB::connection('users_main')
                ->table($idrsDatabase . '.student_id_info')
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->first();

            if (!$studentIdInfo) {
                $studentIdInfo = DB::connection('users_main')
                    ->table($idrsDatabase . '.student_id_info')
                    ->where('student_id', $studentId)
                    ->first();
            }

            $totalBalance = $this->getTotalBalance($studentId, $schoolCode);

            $data = [
                'name' => $student->fullname ?? $user->fullname ?? '',
                'student_id' => $studentId,
                'course' => $student->course ?? '',
                'year_level' => $student->level ?? '',
                'email' => $user->email ?? '',
                'contact' => $student->mobile_number ?? '',
                'address' => $studentIdInfo->residential_address ?? $student->address ?? '',
                'status' => $totalBalance > 0 ? 'Active' : 'Paid',
                'current_school_year' => $this->getCurrentSchoolYear(),
                'program' => $student->course ?? '',
                'college' => $student->school_name ?? '',
            ];

            return new JsonResponse([
                'status' => true,
                'response' => 'Account details retrieved successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $error) {
            return new JsonResponse([
                'status' => false,
                'response' => 'Error: ' . $error->getMessage()
            ], 500);
        }
    }

    public function semesters(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            $userId = $user->user_id ?? null;
            if (!$userId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'User ID not found.'
                ], 400);
            }

            $schoolCode = $user->school_code ?? null;
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found.'
                ], 400);
            }
            $schoolCode = strtolower($schoolCode);

            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get student_id from student_records
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('school_code', $schoolCode)
                ->where('user_id', $userId)
                ->first();

            if (!$studentRecord) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student record not found.'
                ], 400);
            }

            $studentId = $studentRecord->student_id;

            $semesters = [];

            // Get ALL enrollment records for this student
            $enrollment = EnrollmentAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->first();

            if ($enrollment) {
                $semesters[] = [
                    'id' => 1,
                    'name' => $enrollment->school_term ?? 'Current Semester',
                    'school_year' => $enrollment->school_year ?? $this->getCurrentSchoolYear(),
                    'term' => $enrollment->school_term ?? '1st',
                    'subjects' => [],
                    'total_units' => 0,
                    'tuition_fee' => floatval($enrollment->original_amount ?? 0),
                    'miscellaneous_fee' => 0,
                    'other_fees' => floatval($this->getOtherFeesTotal($studentId, $schoolCode)),
                    'total_fee' => floatval($enrollment->original_amount ?? 0),
                    'amount_paid' => floatval($enrollment->paid_amount ?? 0),
                    'balance' => floatval($enrollment->account_balance ?? 0),
                    'status' => floatval($enrollment->account_balance ?? 0) > 0 ? 'partial' : 'paid',
                    // --- ADD THESE FIELDS ---
                    'enrollment_number' => $enrollment->enrollment_number ?? 'N/A',
                    'level' => $studentRecord->level ?? 'N/A',
                    'section' => $studentRecord->section ?? $studentRecord->section_course ?? 'N/A',
                    'section_course' => $studentRecord->section_course ?? 'N/A',
                    // --- END ADD ---
                ];
            }

            // Previous school years
            $previous = PreviousSyAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->get();

            foreach ($previous as $index => $record) {
                if (floatval($record->account_balance ?? 0) > 0) {
                    $semesters[] = [
                        'id' => 100 + $index,
                        'name' => 'Previous Semester',
                        'school_year' => $record->school_year ?? 'Previous Year',
                        'term' => $record->school_term ?? '1st',
                        'subjects' => [],
                        'total_units' => 0,
                        'tuition_fee' => 0,
                        'miscellaneous_fee' => 0,
                        'other_fees' => 0,
                        'total_fee' => floatval($record->account_balance ?? 0),
                        'amount_paid' => 0,
                        'balance' => floatval($record->account_balance ?? 0),
                        'status' => 'paid',
                        // --- ADD THESE FIELDS ---
                        'enrollment_number' => $record->enrollment_number ?? 'N/A',
                        'level' => $record->level ?? 'N/A',
                        'section' => $record->section_course ?? 'N/A',
                        'section_course' => $record->section_course ?? 'N/A',
                        // --- END ADD ---
                    ];
                }
            }

            return new JsonResponse([
                'status' => true,
                'response' => 'Semesters retrieved successfully',
                'data' => $semesters
            ], 200);

        } catch (\Exception $error) {
            return new JsonResponse([
                'status' => false,
                'response' => 'Error: ' . $error->getMessage()
            ], 500);
        }
    }

    public function transactions(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            $userId = $user->user_id ?? null;
            if (!$userId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'User ID not found.'
                ], 400);
            }

            $schoolCode = $user->school_code ?? null;
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found.'
                ], 400);
            }
            $schoolCode = strtolower($schoolCode);

            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get student_id and student details from student_records
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('school_code', $schoolCode)
                ->where('user_id', $userId)
                ->first();

            if (!$studentRecord) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student record not found.'
                ], 400);
            }

            $studentId = $studentRecord->student_id;
            
            // Get level and section from the student record
            $level = $studentRecord->level ?? null;
            $section = $studentRecord->section ?? $studentRecord->section_course ?? null;

            $transactions = [];
            $idCounter = 1;

            // 1. Enrollment transactions
            $enrollments = EnrollmentAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->get();

            foreach ($enrollments as $record) {
                $balance = floatval($record->account_balance ?? 0);
                $original = floatval($record->original_amount ?? 0);
                $paid = floatval($record->paid_amount ?? 0);

                if ($original > 0) {
                    $transactions[] = [
                        'id' => $idCounter++,
                        'date' => $record->created_at ? date('Y-m-d', strtotime($record->created_at)) : date('Y-m-d'),
                        'description' => $record->description ?? 'Tuition Fee',
                        'amount' => -$original,
                        'status' => $balance > 0 ? 'pending' : 'paid',
                        'reference' => $record->enrollment_number ?? null,
                        'category' => 'Tuition',
                        'due_date' => null,
                        'semester_id' => 1,
                        'school_year' => $record->school_year ?? null,
                        'level' => $level,
                        'section' => $section,
                    ];
                }

                if ($paid > 0) {
                    $transactions[] = [
                        'id' => $idCounter++,
                        'date' => $record->last_payment_date ? date('Y-m-d', strtotime($record->last_payment_date)) : date('Y-m-d'),
                        'description' => $record->payment_description ?? 'Payment',
                        'amount' => $paid,
                        'status' => 'completed',
                        'reference' => $record->last_reference_number ?? null,
                        'category' => 'Payment',
                        'due_date' => null,
                        'semester_id' => 1,
                        'school_year' => $record->school_year ?? null,
                        'level' => $level,
                        'section' => $section,
                    ];
                }
            }

            // 2. Other fees transactions
            $otherFees = OtherFeesAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->get();

            foreach ($otherFees as $record) {
                $balance = floatval($record->account_balance ?? 0);
                $original = floatval($record->orig_amount ?? 0);
                $paid = floatval($record->paid_amount ?? 0);

                if ($original > 0) {
                    $transactions[] = [
                        'id' => $idCounter++,
                        'date' => $record->transaction_date ? date('Y-m-d', strtotime($record->transaction_date)) : date('Y-m-d'),
                        'description' => $record->fee_name ?? 'Other Fee',
                        'amount' => -$original,
                        'status' => $balance > 0 ? 'pending' : 'paid',
                        'reference' => $record->last_reference_number ?? null,
                        'category' => 'Other',
                        'due_date' => null,
                        'semester_id' => 1,
                        'school_year' => $record->school_year ?? null,
                        'level' => $level,
                        'section' => $section,
                    ];
                }

                if ($paid > 0) {
                    $transactions[] = [
                        'id' => $idCounter++,
                        'date' => $record->last_payment_date ? date('Y-m-d', strtotime($record->last_payment_date)) : date('Y-m-d'),
                        'description' => $record->payment_description ?? 'Payment',
                        'amount' => $paid,
                        'status' => 'completed',
                        'reference' => $record->last_reference_number ?? null,
                        'category' => 'Payment',
                        'due_date' => null,
                        'semester_id' => 1,
                        'school_year' => $record->school_year ?? null,
                        'level' => $level,
                        'section' => $section,
                    ];
                }
            }

            // 3. Installment transactions
            $installments = MonthlyAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->get();

            foreach ($installments as $record) {
                for ($i = 1; $i <= 10; $i++) {
                    $balanceField = 'month_' . $i . '_account_balance';
                    $balance = floatval($record->$balanceField ?? 0);

                    if ($balance > 0) {
                        $transactions[] = [
                            'id' => $idCounter++,
                            'date' => $record->{'month_' . $i . '_duedate'} ? date('Y-m-d', strtotime($record->{'month_' . $i . '_duedate'})) : date('Y-m-d'),
                            'description' => $record->{'month_' . $i . '_description'} ?? 'Installment',
                            'amount' => -$balance,
                            'status' => $record->{'month_' . $i . '_status'} ?? 'pending',
                            'reference' => $record->enrollment_number ?? null,
                            'category' => 'Installment',
                            'due_date' => $record->{'month_' . $i . '_duedate'} ?? null,
                            'semester_id' => 1,
                            'school_year' => $record->school_year ?? null,
                            'level' => $level,
                            'section' => $section,
                        ];
                    }
                }
            }

            // 4. Prepaid transactions
            $prepaid = PrepaidAccountTransaction::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->orderBy('transaction_date', 'desc')
                ->get();

            foreach ($prepaid as $record) {
                $amount = floatval($record->item_amount ?? 0);
                if ($amount > 0) {
                    $transactions[] = [
                        'id' => $idCounter++,
                        'date' => $record->transaction_date ? date('Y-m-d', strtotime($record->transaction_date)) : date('Y-m-d'),
                        'description' => $record->item_description ?? 'Prepaid Transaction',
                        'amount' => -$amount,
                        'status' => 'completed',
                        'reference' => $record->transaction_reference ?? null,
                        'category' => 'Prepaid',
                        'due_date' => null,
                        'semester_id' => 1,
                        'school_year' => $record->school_year ?? null,
                        'level' => $level,
                        'section' => $section,
                    ];
                }
            }

            usort($transactions, function ($a, $b) {
                return strtotime($b['date']) - strtotime($a['date']);
            });

            return new JsonResponse([
                'status' => true,
                'response' => 'Transactions retrieved successfully',
                'data' => $transactions
            ], 200);

        } catch (\Exception $error) {
            return new JsonResponse([
                'status' => false,
                'response' => 'Error: ' . $error->getMessage()
            ], 500);
        }
    }

    public function paymentHistory(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            $userId = $user->user_id ?? null;
            if (!$userId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'User ID not found.'
                ], 400);
            }

            $schoolCode = $user->school_code ?? null;
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found.'
                ], 400);
            }
            $schoolCode = strtolower($schoolCode);

            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get student_id from student_records
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('school_code', $schoolCode)
                ->where('user_id', $userId)
                ->first();

            if (!$studentRecord) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student record not found.'
                ], 400);
            }

            $studentId = $studentRecord->student_id;
            $paymentHistory = [];
            $idCounter = 1;

            // 1. Prepaid transactions
            $prepaid = PrepaidAccountTransaction::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->orderBy('transaction_date', 'desc')
                ->get();

            foreach ($prepaid as $record) {
                $amount = floatval($record->item_amount ?? 0);
                if ($amount > 0) {
                    $paymentHistory[] = [
                        'id' => $idCounter++,
                        'date' => $record->transaction_date ? date('Y-m-d', strtotime($record->transaction_date)) : date('Y-m-d'),
                        'amount' => $amount,
                        'method' => 'Prepaid',
                        'reference' => $record->transaction_reference ?? 'PRE-' . $idCounter,
                        'status' => 'completed',
                        'semester_id' => 1,
                    ];
                }
            }

            // 2. Enrollment payments
            $enrollments = EnrollmentAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->whereNotNull('paid_amount')
                ->where('paid_amount', '>', 0)
                ->get();

            foreach ($enrollments as $record) {
                $paid = floatval($record->paid_amount ?? 0);
                if ($paid > 0) {
                    $paymentHistory[] = [
                        'id' => $idCounter++,
                        'date' => $record->last_payment_date ? date('Y-m-d', strtotime($record->last_payment_date)) : date('Y-m-d'),
                        'amount' => $paid,
                        'method' => 'Cash',
                        'reference' => $record->last_reference_number ?? 'PAY-' . $idCounter,
                        'status' => 'completed',
                        'semester_id' => 1,
                    ];
                }
            }

            // 3. Other fees payments
            $otherFees = OtherFeesAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->whereNotNull('paid_amount')
                ->where('paid_amount', '>', 0)
                ->get();

            foreach ($otherFees as $record) {
                $paid = floatval($record->paid_amount ?? 0);
                if ($paid > 0) {
                    $paymentHistory[] = [
                        'id' => $idCounter++,
                        'date' => $record->last_payment_date ? date('Y-m-d', strtotime($record->last_payment_date)) : date('Y-m-d'),
                        'amount' => $paid,
                        'method' => 'Cash',
                        'reference' => $record->last_reference_number ?? 'PAY-' . $idCounter,
                        'status' => 'completed',
                        'semester_id' => 1,
                    ];
                }
            }

            usort($paymentHistory, function ($a, $b) {
                return strtotime($b['date']) - strtotime($a['date']);
            });

            if (empty($paymentHistory)) {
                $paymentHistory[] = [
                    'id' => 1,
                    'date' => date('Y-m-d'),
                    'amount' => 0,
                    'method' => 'N/A',
                    'reference' => 'PAY-001',
                    'status' => 'completed',
                    'semester_id' => 1,
                ];
            }

            return new JsonResponse([
                'status' => true,
                'response' => 'Payment history retrieved successfully',
                'data' => $paymentHistory
            ], 200);

        } catch (\Exception $error) {
            return new JsonResponse([
                'status' => false,
                'response' => 'Error: ' . $error->getMessage()
            ], 500);
        }
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    private function getTotalBalance(string $studentId, string $schoolCode): float
    {
        $total = 0;

        $enrollment = EnrollmentAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->sum('account_balance');
        $total += floatval($enrollment);

        $otherFees = OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->sum('account_balance');
        $total += floatval($otherFees);

        $installments = MonthlyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->get();

        foreach ($installments as $record) {
            for ($i = 1; $i <= 10; $i++) {
                $balanceField = 'month_' . $i . '_account_balance';
                $total += floatval($record->$balanceField ?? 0);
            }
        }

        return $total;
    }

    private function getOtherFeesTotal(string $studentId, string $schoolCode): float
    {
        return floatval(OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->sum('account_balance'));
    }

    private function getCurrentSchoolYear(): string
    {
        $currentDate = Carbon::now();
        $year = (int) $currentDate->format('Y');
        $month = (int) $currentDate->format('n');

        if ($month >= 6) {
            return $year . '-' . ($year + 1);
        }
        return ($year - 1) . '-' . $year;
    }

    private function getMonthName(int $monthNumber): string
    {
        $months = [
            1 => 'June',
            2 => 'July',
            3 => 'August',
            4 => 'September',
            5 => 'October',
            6 => 'November',
            7 => 'December',
            8 => 'January',
            9 => 'February',
            10 => 'March',
            11 => 'April',
            12 => 'May',
        ];

        return $months[$monthNumber] ?? 'Unknown';
    }
}