<?php

namespace App\Http\Controllers\api\account_ledger;

use App\Http\Controllers\Controller;
use App\Helpers\DatabaseManager;
use App\Models\PatchUpdates\PreviousSyAccountBalance;
use App\Models\PatchUpdates\EnrollmentAccountBalance;
use App\Models\PatchUpdates\MonthlyAccountBalance;
use App\Models\PatchUpdates\OtherFeesAccountBalance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AccountBalanceDashboardController extends Controller
{
    /**
     * Get the complete dashboard data for a student
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            $schoolCode = $this->getSchoolCode($user, $request);
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found.'
                ], 400);
            }

            $studentId = $this->getStudentId($user, $request, $schoolCode);
            if (!$studentId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student ID not found.'
                ], 400);
            }

            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get student details
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('student_id', $studentId)
                ->first();

            $level = $studentRecord->level ?? 'N/A';
            $section = $studentRecord->section ?? $studentRecord->section_course ?? 'N/A';
            $course = $studentRecord->course ?? 'N/A';
            $fullname = $studentRecord->fullname ?? $user->fullname ?? $user->name ?? null;

            $previousBalance = $this->getPreviousAccountBalance($studentId, $schoolCode);
            $enrollmentBalance = $this->getEnrollmentBalance($studentId, $schoolCode);
            $installmentBalance = $this->getInstallmentBalance($studentId, $schoolCode);
            $otherFeesBalance = $this->getOtherFeesBalance($studentId, $schoolCode);

            $totalAccountBalance = $previousBalance['total'] + 
                                   $enrollmentBalance['total'] + 
                                   $installmentBalance['total'] + 
                                   $otherFeesBalance['total'];

            $data = [
                'student_info' => [
                    'student_id' => $studentId,
                    'school_code' => $schoolCode,
                    'database_name' => $databaseName,
                    'user_name' => $fullname,
                    'user_id' => $user->user_id ?? null,
                    'level' => $level,
                    'section' => $section,
                    'course' => $course,
                ],
                'previous_account_balance' => $previousBalance,
                'current_enrollment_fee_balance' => $enrollmentBalance,
                'total_current_installment_balance' => $installmentBalance,
                'other_fees_account_balance' => $otherFeesBalance,
                'total_account_balance' => [
                    'total' => $totalAccountBalance,
                    'formatted' => '₱' . number_format($totalAccountBalance, 2),
                ],
            ];

            return new JsonResponse([
                'status' => true,
                'response' => 'Dashboard data retrieved successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $error) {
            return new JsonResponse([
                'status' => false,
                'response' => 'Error: ' . $error->getMessage()
            ], 500);
        }
    }

    /**
     * Get student's full account balance summary (compact version)
     */
    public function summary(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            $schoolCode = $this->getSchoolCode($user, $request);
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found.'
                ], 400);
            }

            $studentId = $this->getStudentId($user, $request, $schoolCode);
            if (!$studentId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student ID not found.'
                ], 400);
            }

            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get student details
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('student_id', $studentId)
                ->first();

            $level = $studentRecord->level ?? 'N/A';
            $section = $studentRecord->section ?? $studentRecord->section_course ?? 'N/A';
            $course = $studentRecord->course ?? 'N/A';

            $currentSchoolYear = $this->getCurrentSchoolYear();

            // Get balances directly
            $previous = PreviousSyAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->where('school_year', '!=', $currentSchoolYear)
                ->sum('account_balance');

            $enrollment = EnrollmentAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->where('school_year', $currentSchoolYear)
                ->sum('account_balance');

            $installmentRecords = MonthlyAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->where('school_year', $currentSchoolYear)
                ->get();

            $installmentTotal = 0;
            foreach ($installmentRecords as $record) {
                for ($i = 1; $i <= 10; $i++) {
                    $balanceField = 'month_' . $i . '_account_balance';
                    $installmentTotal += floatval($record->$balanceField ?? 0);
                }
            }

            $otherFees = OtherFeesAccountBalance::active()
                ->where('school_code', $schoolCode)
                ->where('student_id', $studentId)
                ->sum('account_balance');

            $totalBalance = floatval($previous) + floatval($enrollment) + floatval($installmentTotal) + floatval($otherFees);

            return new JsonResponse([
                'status' => true,
                'response' => 'Balance summary retrieved successfully',
                'data' => [
                    'student_info' => [
                        'student_id' => $studentId,
                        'school_code' => $schoolCode,
                        'database_name' => $databaseName,
                        'user_name' => $user->fullname ?? $user->name ?? null,
                        'level' => $level,
                        'section' => $section,
                        'course' => $course,
                    ],
                    'previous_balance' => [
                        'total' => floatval($previous),
                        'formatted' => '₱' . number_format(floatval($previous), 2),
                    ],
                    'enrollment_balance' => [
                        'total' => floatval($enrollment),
                        'formatted' => '₱' . number_format(floatval($enrollment), 2),
                    ],
                    'installment_balance' => [
                        'total' => floatval($installmentTotal),
                        'formatted' => '₱' . number_format(floatval($installmentTotal), 2),
                    ],
                    'other_fees_balance' => [
                        'total' => floatval($otherFees),
                        'formatted' => '₱' . number_format(floatval($otherFees), 2),
                    ],
                    'total_account_balance' => [
                        'total' => floatval($totalBalance),
                        'formatted' => '₱' . number_format(floatval($totalBalance), 2),
                    ],
                ]
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

    private function getSchoolCode($user, Request $request): ?string
    {
        if ($request->has('school_code')) {
            return strtolower($request->get('school_code'));
        }

        if (isset($user->school_code) && $user->school_code) {
            return strtolower($user->school_code);
        }

        if (isset($user->user_id) && $user->user_id) {
            if (preg_match('/^([A-Z]{2,5})/', $user->user_id, $matches)) {
                return strtolower($matches[1]);
            }
        }

        if (isset($user->username) && $user->username) {
            if (preg_match('/^([A-Z]{2,5})/', $user->username, $matches)) {
                return strtolower($matches[1]);
            }
        }

        return null;
    }

    private function getStudentId($user, Request $request, string $schoolCode): ?string
    {
        // If student_id is passed in request, use it
        if ($request->has('student_id')) {
            return $request->get('student_id');
        }

        // If user object has student_id, use it
        if (isset($user->student_id) && $user->student_id) {
            return $user->student_id;
        }

        try {
            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);
            
            // Try to find by user_id with school_code match (most specific)
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('school_code', $schoolCode)
                ->where('user_id', $user->user_id)
                ->first();

            if ($studentRecord && isset($studentRecord->student_id)) {
                return $studentRecord->student_id;
            }

            // If not found, try by email with school_code
            if (isset($user->email) && $user->email) {
                $studentRecord = DB::connection($databaseName)
                    ->table('student_records')
                    ->where('school_code', $schoolCode)
                    ->where('email', $user->email)
                    ->first();

                if ($studentRecord && isset($studentRecord->student_id)) {
                    return $studentRecord->student_id;
                }
            }

            // Try by mobile_number with school_code
            if (isset($user->user_id) && $user->user_id) {
                $studentRecord = DB::connection($databaseName)
                    ->table('student_records')
                    ->where('school_code', $schoolCode)
                    ->where('mobile_number', $user->user_id)
                    ->first();

                if ($studentRecord && isset($studentRecord->student_id)) {
                    return $studentRecord->student_id;
                }
            }

            // Try by user_id without school_code (fallback)
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('user_id', $user->user_id)
                ->first();

            if ($studentRecord && isset($studentRecord->student_id)) {
                return $studentRecord->student_id;
            }

            // Try by email without school_code (fallback)
            if (isset($user->email) && $user->email) {
                $studentRecord = DB::connection($databaseName)
                    ->table('student_records')
                    ->where('email', $user->email)
                    ->first();

                if ($studentRecord && isset($studentRecord->student_id)) {
                    return $studentRecord->student_id;
                }
            }

            // Log that we couldn't find the student
            Log::warning('Student record not found in getStudentId', [
                'user_id' => $user->user_id ?? 'null',
                'email' => $user->email ?? 'null',
                'school_code' => $schoolCode,
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getStudentId: ' . $e->getMessage());
        }

        return null;
    }

    private function getPreviousAccountBalance(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        
        $total = PreviousSyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->where('school_year', '!=', $currentSchoolYear)
            ->sum('account_balance');

        $records = PreviousSyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->where('school_year', '!=', $currentSchoolYear)
            ->get();

        return [
            'total' => floatval($total),
            'formatted' => '₱' . number_format(floatval($total), 2),
            'records' => $records,
            'count' => $records->count(),
        ];
    }

    private function getEnrollmentBalance(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        
        $total = EnrollmentAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->where('school_year', $currentSchoolYear)
            ->sum('account_balance');

        $records = EnrollmentAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->where('school_year', $currentSchoolYear)
            ->get();

        return [
            'total' => floatval($total),
            'formatted' => '₱' . number_format(floatval($total), 2),
            'records' => $records,
            'count' => $records->count(),
            'school_year' => $currentSchoolYear,
        ];
    }

    private function getInstallmentBalance(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        
        $records = MonthlyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->where('school_year', $currentSchoolYear)
            ->get();

        $total = 0;

        foreach ($records as $record) {
            for ($i = 1; $i <= 10; $i++) {
                $balanceField = 'month_' . $i . '_account_balance';
                $total += floatval($record->$balanceField ?? 0);
            }
        }

        return [
            'total' => floatval($total),
            'formatted' => '₱' . number_format(floatval($total), 2),
            'records' => $records,
            'count' => $records->count(),
            'school_year' => $currentSchoolYear,
        ];
    }

    private function getOtherFeesBalance(string $studentId, string $schoolCode): array
    {
        $total = OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->sum('account_balance');

        $records = OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->where('student_id', $studentId)
            ->get();

        return [
            'total' => floatval($total),
            'formatted' => '₱' . number_format(floatval($total), 2),
            'records' => $records,
            'count' => $records->count(),
        ];
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