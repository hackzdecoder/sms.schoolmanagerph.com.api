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

class AccountBalanceDashboardController extends Controller
{
    /**
     * Get the complete dashboard data for a student
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Get authenticated user
            $user = Auth::user();
            
            if (!$user) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Unauthenticated. Please login first.'
                ], 401);
            }

            // Get school code - try multiple sources
            $schoolCode = $this->getSchoolCode($user, $request);
            
            if (!$schoolCode) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'School code not found. Please ensure your account has a school_code assigned.'
                ], 400);
            }

            // Get student_id - try multiple sources
            $studentId = $this->getStudentId($user, $request, $schoolCode);
            
            if (!$studentId) {
                return new JsonResponse([
                    'status' => false,
                    'response' => 'Student ID not found. Please provide student_id parameter or ensure your account is linked to a student.'
                ], 400);
            }

            // Ensure database connection is registered
            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);

            // Get all account balances
            $previousBalance = $this->getPreviousAccountBalance($studentId, $schoolCode);
            $enrollmentBalance = $this->getEnrollmentBalance($studentId, $schoolCode);
            $installmentBalance = $this->getInstallmentBalance($studentId, $schoolCode);
            $otherFeesBalance = $this->getOtherFeesBalance($studentId, $schoolCode);
            $prepaidBalance = $this->getPrepaidBalance($studentId, $schoolCode);
            $installmentDues = $this->getCurrentInstallmentDues($studentId, $schoolCode);
            $overdueInstallments = $this->getOverdueInstallments($studentId, $schoolCode);

            // Calculate total account balance
            $totalAccountBalance = $previousBalance['total'] + 
                                   $enrollmentBalance['total'] + 
                                   $installmentBalance['total'] + 
                                   $otherFeesBalance['total'];

            $data = [
                'student_info' => [
                    'student_id' => $studentId,
                    'school_code' => $schoolCode,
                    'database_name' => $databaseName,
                    'user_name' => $user->fullname ?? $user->name ?? null,
                    'user_id' => $user->user_id ?? null,
                ],
                'previous_account_balance' => $previousBalance,
                'current_enrollment_fee_balance' => $enrollmentBalance,
                'total_current_installment_balance' => $installmentBalance,
                'other_fees_account_balance' => $otherFeesBalance,
                'total_account_balance' => [
                    'total' => $totalAccountBalance,
                    'formatted' => '₱' . number_format($totalAccountBalance, 2),
                ],
                'prepaid_account_available_balance' => $prepaidBalance,
                'current_installment_account_dues' => $installmentDues,
                'current_overdue_installment_accounts' => $overdueInstallments,
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

            $previous = $this->getPreviousAccountBalance($studentId, $schoolCode);
            $enrollment = $this->getEnrollmentBalance($studentId, $schoolCode);
            $installment = $this->getInstallmentBalance($studentId, $schoolCode);
            $otherFees = $this->getOtherFeesBalance($studentId, $schoolCode);
            $prepaid = $this->getPrepaidBalance($studentId, $schoolCode);

            $totalBalance = $previous['total'] + $enrollment['total'] + $installment['total'] + $otherFees['total'];

            return new JsonResponse([
                'status' => true,
                'response' => 'Balance summary retrieved successfully',
                'data' => [
                    'student_info' => [
                        'student_id' => $studentId,
                        'school_code' => $schoolCode,
                        'database_name' => $databaseName,
                        'user_name' => $user->fullname ?? $user->name ?? null,
                    ],
                    'previous_balance' => [
                        'total' => $previous['total'],
                        'formatted' => $previous['formatted'],
                    ],
                    'enrollment_balance' => [
                        'total' => $enrollment['total'],
                        'formatted' => $enrollment['formatted'],
                    ],
                    'installment_balance' => [
                        'total' => $installment['total'],
                        'formatted' => $installment['formatted'],
                    ],
                    'other_fees_balance' => [
                        'total' => $otherFees['total'],
                        'formatted' => $otherFees['formatted'],
                    ],
                    'total_account_balance' => [
                        'total' => $totalBalance,
                        'formatted' => '₱' . number_format($totalBalance, 2),
                    ],
                    'prepaid_balance' => [
                        'total' => $prepaid['total'],
                        'formatted' => $prepaid['formatted'],
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

    /**
     * Get school code from user or request
     */
    private function getSchoolCode($user, Request $request): ?string
    {
        // Priority 1: From request parameter
        if ($request->has('school_code')) {
            return strtolower($request->get('school_code'));
        }

        // Priority 2: From authenticated user
        if (isset($user->school_code) && $user->school_code) {
            return strtolower($user->school_code);
        }

        // Priority 3: From user_id pattern
        if (isset($user->user_id) && $user->user_id) {
            if (preg_match('/^([A-Z]{2,5})/', $user->user_id, $matches)) {
                return strtolower($matches[1]);
            }
        }

        // Priority 4: From username pattern
        if (isset($user->username) && $user->username) {
            if (preg_match('/^([A-Z]{2,5})/', $user->username, $matches)) {
                return strtolower($matches[1]);
            }
        }

        return null;
    }

    /**
     * Get student_id from user, request, or school database
     */
    private function getStudentId($user, Request $request, string $schoolCode): ?string
    {
        // Priority 1: From request parameter
        if ($request->has('student_id')) {
            return $request->get('student_id');
        }

        // Priority 2: From authenticated user's student_id attribute
        if (isset($user->student_id) && $user->student_id) {
            return $user->student_id;
        }

        // Priority 3: Query the school database for student_records
        try {
            $databaseName = DatabaseManager::generateDatabaseName($schoolCode);
            DatabaseManager::connect($databaseName);
            
            // Try to find student by user_id
            $studentRecord = DB::connection($databaseName)
                ->table('student_records')
                ->where('user_id', $user->user_id)
                ->orWhere('userid', $user->user_id)
                ->orWhere('email', $user->email)
                ->first();

            if ($studentRecord) {
                return $studentRecord->student_id ?? $studentRecord->id ?? null;
            }

            // Try users table in school database
            $userRecord = DB::connection($databaseName)
                ->table('users')
                ->where('user_id', $user->user_id)
                ->orWhere('id', $user->id)
                ->first();

            if ($userRecord && isset($userRecord->student_id)) {
                return $userRecord->student_id;
            }
        } catch (\Exception $e) {
            \Log::error('Failed to get student_id from school database: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * 1. Previous Account Balance
     */
    private function getPreviousAccountBalance(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        
        $total = PreviousSyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->where('school_year', '!=', $currentSchoolYear)
            ->sum('account_balance');

        $records = PreviousSyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->where('school_year', '!=', $currentSchoolYear)
            ->get();

        $schoolYears = PreviousSyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->where('school_year', '!=', $currentSchoolYear)
            ->distinct()
            ->pluck('school_year')
            ->values()
            ->toArray();

        return [
            'total' => $total,
            'formatted' => '₱' . number_format($total, 2),
            'records' => $records,
            'count' => $records->count(),
            'school_years' => $schoolYears,
        ];
    }

    /**
     * 2. Current Enrollment Fee Balance
     */
    private function getEnrollmentBalance(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        
        $total = EnrollmentAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->bySchoolYear($currentSchoolYear)
            ->sum('account_balance');

        $records = EnrollmentAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->bySchoolYear($currentSchoolYear)
            ->get();

        return [
            'total' => $total,
            'formatted' => '₱' . number_format($total, 2),
            'records' => $records,
            'count' => $records->count(),
            'school_year' => $currentSchoolYear,
        ];
    }

    /**
     * 3. Total Current Installment Balance
     */
    private function getInstallmentBalance(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        
        $records = MonthlyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->bySchoolYear($currentSchoolYear)
            ->get();

        $total = 0;
        $monthlyDetails = [];

        foreach ($records as $record) {
            for ($i = 1; $i <= 12; $i++) {
                $balanceField = 'month_' . $i . '_account_balance';
                $statusField = 'month_' . $i . '_status';
                $dueDateField = 'month_' . $i . '_duedate';
                $origAmountField = 'month_' . $i . '_orig_amount';
                $paidAmountField = 'month_' . $i . '_paid_amount';

                $balance = $record->$balanceField ?? 0;
                $total += $balance;
                
                $monthlyDetails[] = [
                    'month' => $i,
                    'month_name' => $this->getMonthName($i),
                    'due_date' => $record->$dueDateField,
                    'original_amount' => $record->$origAmountField ?? 0,
                    'paid_amount' => $record->$paidAmountField ?? 0,
                    'balance' => $balance,
                    'status' => $record->$statusField ?? 'pending',
                    'student_name' => $record->student_name,
                    'level' => $record->level,
                    'section' => $record->section_course,
                ];
            }
        }

        return [
            'total' => $total,
            'formatted' => '₱' . number_format($total, 2),
            'records' => $records,
            'monthly_details' => $monthlyDetails,
            'count' => $records->count(),
            'school_year' => $currentSchoolYear,
        ];
    }

    /**
     * 4. Other Fees Account Balance
     */
    private function getOtherFeesBalance(string $studentId, string $schoolCode): array
    {
        $total = OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->sum('account_balance');

        $records = OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->get();

        $feeTypes = OtherFeesAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->distinct()
            ->pluck('fee_name')
            ->values()
            ->toArray();

        return [
            'total' => $total,
            'formatted' => '₱' . number_format($total, 2),
            'records' => $records,
            'count' => $records->count(),
            'fee_types' => $feeTypes,
        ];
    }

    /**
     * 5. Prepaid Account Available Balance
     */
    private function getPrepaidBalance(string $studentId, string $schoolCode): array
    {
        $total = PrepaidAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->sum('prepaid_balance');

        $records = PrepaidAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->get();

        $recentTransactions = PrepaidAccountTransaction::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->orderBy('transaction_date', 'desc')
            ->limit(5)
            ->get();

        return [
            'total' => $total,
            'formatted' => '₱' . number_format($total, 2),
            'records' => $records,
            'recent_transactions' => $recentTransactions,
            'count' => $records->count(),
        ];
    }

    /**
     * 6. Current Installment Account Dues
     */
    private function getCurrentInstallmentDues(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        $currentDate = Carbon::now();
        $currentMonth = (int) $currentDate->format('n');
        $installmentMonth = $this->getInstallmentMonth($currentMonth);
        
        $records = MonthlyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->bySchoolYear($currentSchoolYear)
            ->get();

        $dues = [];
        $totalDue = 0;

        foreach ($records as $record) {
            $monthField = 'month_' . $installmentMonth;
            $dueDateField = $monthField . '_duedate';
            $origAmountField = $monthField . '_orig_amount';
            $paidAmountField = $monthField . '_paid_amount';
            $balanceField = $monthField . '_account_balance';
            $statusField = $monthField . '_status';

            $balance = $record->$balanceField ?? 0;
            $dueDate = $record->$dueDateField;

            if ($dueDate && $balance > 0) {
                $dues[] = [
                    'month' => $installmentMonth,
                    'month_name' => $this->getMonthName($installmentMonth),
                    'due_date' => $dueDate,
                    'original_amount' => $record->$origAmountField ?? 0,
                    'paid_amount' => $record->$paidAmountField ?? 0,
                    'balance' => $balance,
                    'status' => $record->$statusField ?? 'pending',
                    'student_name' => $record->student_name,
                    'level' => $record->level,
                    'section' => $record->section_course,
                    'school_year' => $record->school_year,
                ];
                $totalDue += $balance;
            }
        }

        $futureDues = collect();
        for ($i = $installmentMonth + 1; $i <= 12; $i++) {
            foreach ($records as $record) {
                $balanceField = 'month_' . $i . '_account_balance';
                $dueDateField = 'month_' . $i . '_duedate';
                $balance = $record->$balanceField ?? 0;
                $dueDate = $record->$dueDateField;
                
                if ($dueDate && $balance > 0) {
                    $futureDues->push([
                        'month' => $i,
                        'month_name' => $this->getMonthName($i),
                        'due_date' => $dueDate,
                        'balance' => $balance,
                        'status' => 'upcoming',
                        'student_name' => $record->student_name,
                    ]);
                }
            }
        }

        return [
            'total_due' => $totalDue,
            'formatted' => '₱' . number_format($totalDue, 2),
            'current_dues' => $dues,
            'future_dues' => $futureDues->values()->toArray(),
            'current_month' => $currentDate->format('F Y'),
            'installment_month' => $installmentMonth,
            'current_count' => count($dues),
            'future_count' => $futureDues->count(),
        ];
    }

    /**
     * 7. Current Overdue Installment Accounts
     */
    private function getOverdueInstallments(string $studentId, string $schoolCode): array
    {
        $currentSchoolYear = $this->getCurrentSchoolYear();
        $currentDate = Carbon::now();
        
        $records = MonthlyAccountBalance::active()
            ->where('school_code', $schoolCode)
            ->byStudent($studentId)
            ->bySchoolYear($currentSchoolYear)
            ->get();

        $overdueMonths = [];
        $totalOverdue = 0;

        foreach ($records as $record) {
            for ($i = 1; $i <= 12; $i++) {
                $statusField = 'month_' . $i . '_status';
                $balanceField = 'month_' . $i . '_account_balance';
                $dueDateField = 'month_' . $i . '_duedate';
                $origAmountField = 'month_' . $i . '_orig_amount';
                $paidAmountField = 'month_' . $i . '_paid_amount';

                $status = $record->$statusField ?? 'pending';
                $balance = $record->$balanceField ?? 0;
                $dueDate = $record->$dueDateField;

                if ($status === 'overdue' && $balance > 0) {
                    $daysOverdue = 0;
                    if ($dueDate) {
                        $dueDateObj = Carbon::parse($dueDate);
                        $daysOverdue = $currentDate->diffInDays($dueDateObj, false);
                        $daysOverdue = $daysOverdue > 0 ? $daysOverdue : 0;
                    }

                    $overdueMonths[] = [
                        'month' => $i,
                        'month_name' => $this->getMonthName($i),
                        'due_date' => $dueDate,
                        'original_amount' => $record->$origAmountField ?? 0,
                        'paid_amount' => $record->$paidAmountField ?? 0,
                        'balance' => $balance,
                        'status' => $status,
                        'days_overdue' => $daysOverdue,
                        'student_name' => $record->student_name,
                        'level' => $record->level,
                        'section' => $record->section_course,
                        'school_year' => $record->school_year,
                        'enrollment_number' => $record->enrollment_number,
                    ];
                    $totalOverdue += $balance;
                }
            }
        }

        usort($overdueMonths, function($a, $b) {
            return $a['month'] - $b['month'];
        });

        return [
            'total_overdue' => $totalOverdue,
            'formatted' => '₱' . number_format($totalOverdue, 2),
            'overdue_months' => $overdueMonths,
            'count' => count($overdueMonths),
            'school_year' => $currentSchoolYear,
        ];
    }

    /**
     * Get the current school year based on the system date
     * School year runs from June to May
     */
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

    /**
     * Map calendar month to installment month (June = 1, July = 2, etc.)
     */
    private function getInstallmentMonth(int $month): int
    {
        if ($month >= 6) {
            return $month - 5;
        }
        return $month + 7;
    }

    /**
     * Get month name from installment month number (1-12)
     */
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