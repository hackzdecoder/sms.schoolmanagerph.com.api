<?php

namespace App\Http\Controllers\api\auth;

use App\Http\Controllers\Controller;
use App\Helpers\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Mail;
use Log;

class EmailController extends Controller
{
  protected string $trademarksConnection = 'trademarks';

  /**
   * Get company name from trademarks database
   */
  private function getCompanyName(): string
  {
    try {
      // FIXED: Use DB::connection('trademarks') instead of DatabaseManager::connectSpecial()
      $company = DB::connection('trademarks')
        ->table('companies')
        ->select('company_name')
        ->first();

      // REMOVED: DatabaseManager::disconnect('special_trademarks');

      return $company->company_name;
    } catch (\Exception $e) {
      return $e->getMessage();
    }
  }

  public function updateEmail(Request $request)
  {
    $user = $request->user();

    $validator = Validator::make($request->all(), [
      'email' => [
        'required',
        'email',
        Rule::unique('users')->ignore($user->id),
      ],
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $validator->errors(),
      ], 422);
    }

    if ($user->email && strtolower(trim($user->email)) === strtolower(trim($request->email))) {
      return response()->json([
        'success' => false,
        'message' => 'This email is already registered to your account.',
        'errors' => ['email' => ['This email is already registered to your account.']],
      ], 422);
    }

    DB::table('users')
      ->where('id', $user->id)
      ->update([
        'email' => $request->email,
        'email_verified_at' => Carbon::now(),
        'updated_at' => DB::raw('updated_at'),
      ]);

    $updatedData = DB::table('users')
      ->where('id', $user->id)
      ->select('email', 'email_verified_at')
      ->first();

    return response()->json([
      'success' => true,
      'message' => 'Email updated successfully',
      'data' => [
        'email' => $updatedData->email,
        'email_verified_at' => $updatedData->email_verified_at,
      ],
    ], 200);
  }

  public function resetPasswordRequestLvlOne(Request $request)
  {
      // 1. Merge and trim inputs
      $request->merge([
          'username' => trim($request->username),
          'school_code' => trim($request->school_code ?? ''),
      ]);

      // 2. Validate - both username and school_code are REQUIRED
      $validator = Validator::make($request->all(), [
          'username' => 'required|string',
          'school_code' => 'required|string',
      ], [
          'username.required' => 'Username is required.',
          'school_code.required' => 'School code is required.',
      ]);

      if ($validator->fails()) {
          return response()->json([
              'success' => false,
              'status' => 422,
              'message' => 'Validation failed.',
              'errors' => $validator->errors(),
          ], 422);
      }

      // 3. Find user with BOTH username AND school_code
      $user = User::where('username', $request->username)
          ->where('school_code', $request->school_code)
          ->first();

      if (!$user) {
          return response()->json([
              'success' => false,
              'status' => 404,
              'message' => 'User not found for this school.',
          ], 404);
      }

      // 4. Check if account is active
      if ($user->account_status !== 'active') {
          return response()->json([
              'success' => false,
              'status' => 403,
              'message' => 'Your account has been deactivated',
              'account_status' => $user->account_status,
          ], 403);
      }

      // 5. Check if user has an email
      if (!$user->email) {
          return response()->json([
              'success' => false,
              'status' => 400,
              'message' => 'This account does not have a registered email',
          ], 400);
      }

      // 6. Generate OTP
      $otp = rand(100000, 999999);

      // 7. Save OTP to database
      DB::table('users')
          ->where('id', $user->id)
          ->update([
              'otp_code' => $otp,
              'otp_verified_at' => null,
              'otp_code_expired_at' => Carbon::now()->addMinutes(5),
              'updated_at' => DB::raw('updated_at'),
          ]);

      // 8. Get company name for email
      $companyName = $this->getCompanyName();

      // 9. Send OTP email
      $emailBody = <<<TXT
          Your One-Time Password (OTP) is: $otp

          (valid for 5 minutes).

          ***Please do not reply to this email. This is an automated confirmation that we have received your request for system password reset.***

          This e-mail transmission is intended only for the addressee and may contain confidential information. Confidentiality is not waived if you are not the intended recipient of this e-mail, nor may you use, review, disclose, disseminate or copy any information contained in or attached to it. If you received this e-mail in error please delete it and any attachments and notify us immediately by reply e-mail. $companyName does not warrant that any attachments are free from viruses or other defects. You assume all liability for any loss, damage or other consequences which may arise from opening or using the attachments.
      TXT;

      try {
          Mail::raw($emailBody, function ($message) use ($user) {
              $message->to($user->email)
                  ->subject('Password Reset OTP');
          });
      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'status' => 500,
              'message' => 'Failed to send OTP email.',
              'error' => $e->getMessage(),
          ], 500);
      }

      // 10. Return success response
      return response()->json([
          'success' => true,
          'status' => 200,
          'message' => 'OTP sent successfully.',
          'data' => [
              'username' => $user->username,
              'email' => $user->email,
              'email_hint' => substr($user->email, 0, 3) . '****' . strstr($user->email, '@'),
          ],
      ], 200);
  }
  
  public function resetPasswordRequestLvlTwo(Request $request)
  {
      $request->merge([
          'username' => trim($request->username),
          'school_code' => trim($request->school_code ?? ''),
      ]);

      $validator = Validator::make($request->all(), [
          'username' => 'required|string',
          'school_code' => 'required|string',
      ], [
          'username.required' => 'Username is required.',
          'school_code.required' => 'School code is required.',
      ]);

      if ($validator->fails()) {
          return response()->json([
              'success' => false,
              'status' => 422,
              'message' => 'Validation failed.',
              'errors' => $validator->errors(),
          ], 422);
      }

      // ✅ Find user with BOTH username AND school_code
      $user = User::where('username', $request->username)
          ->where('school_code', $request->school_code)
          ->first();

      if (!$user) {
          return response()->json([
              'success' => false,
              'status' => 404,
              'message' => 'User not found for this school.',
          ], 404);
      }

      if ($user->account_status !== 'active') {
          return response()->json([
              'success' => false,
              'status' => 403,
              'message' => 'Your account has been deactivated',
              'account_status' => $user->account_status,
          ], 403);
      }

      if (empty($user->email)) {
          return response()->json([
              'success' => false,
              'status' => 400,
              'message' => 'This account does not have a registered email',
          ], 400);
      }

      if (empty($user->assigned_admin_email)) {
          return response()->json([
              'success' => false,
              'status' => 400,
              'message' => 'No assigned admin email found for this user. Please contact support.',
          ], 400);
      }

      // ✅ Get full name from student_records
      $fullName = $user->username; // Default fallback
      $schoolCode = $user->school_code ?? null;

      Log::info('Fetching student profile for user', [
          'user_id' => $user->user_id,
          'username' => $user->username,
          'school_code' => $schoolCode
      ]);

      if (!$schoolCode) {
          // Try to extract school code from username or user_id
          if (preg_match('/^([a-z]{2,5})_/i', $user->username ?? '', $schoolCodeMatches)) {
              $schoolCode = strtolower($schoolCodeMatches[1]);
          } else if (preg_match('/^([a-z]{2,5})/i', $user->user_id ?? '', $schoolCodeMatches)) {
              $schoolCode = strtolower($schoolCodeMatches[1]);
          }
      } else {
          $schoolCode = strtolower(trim($schoolCode));
      }

      // If school code is found, try to fetch student profile
      if ($schoolCode) {
          try {
              $targetDatabaseName = DatabaseManager::generateDatabaseName($schoolCode);
              Log::info('Connecting to school database', [
                  'database' => $targetDatabaseName,
                  'school_code' => $schoolCode
              ]);

              $schoolDatabaseConnection = DatabaseManager::connect($targetDatabaseName);

              // Debug: Check if user_id exists in student_records
              $studentProfile = $schoolDatabaseConnection
                  ->table('student_records')
                  ->where('user_id', $user->user_id)
                  ->first();

              Log::info('Student profile query result', [
                  'found' => $studentProfile ? 'Yes' : 'No',
                  'user_id' => $user->user_id,
                  'fullname' => $studentProfile->fullname ?? 'Not set'
              ]);

              if ($studentProfile && !empty($studentProfile->fullname)) {
                  $fullName = $studentProfile->fullname;
                  Log::info('✅ Successfully fetched student full name', [
                      'user_id' => $user->user_id,
                      'school_code' => $schoolCode,
                      'fullname' => $fullName
                  ]);
              } else {
                  Log::warning('⚠️ No student profile or fullname found for user', [
                      'user_id' => $user->user_id,
                      'school_code' => $schoolCode,
                      'student_profile_exists' => $studentProfile ? 'Yes' : 'No',
                      'fullname_value' => $studentProfile->fullname ?? 'NULL'
                  ]);

                  // ✅ Fallback: Try to get fullname from users table if it exists
                  if (!empty($user->fullname)) {
                      $fullName = $user->fullname;
                      Log::info('Using fullname from users table as fallback', [
                          'fullname' => $fullName
                      ]);
                  }
              }

              DatabaseManager::disconnect($targetDatabaseName);

          } catch (\Exception $e) {
              Log::error('❌ Could not fetch student profile, using username as fallback', [
                  'user_id' => $user->id,
                  'school_code' => $schoolCode,
                  'error' => $e->getMessage(),
                  'trace' => $e->getTraceAsString()
              ]);

              // ✅ Fallback: Try to get fullname from users table
              if (!empty($user->fullname)) {
                  $fullName = $user->fullname;
              }
          }
      } else {
          Log::warning('⚠️ Could not determine school code for user', [
              'user_id' => $user->id,
              'username' => $user->username,
          ]);

          // ✅ Fallback: Try to get fullname from users table
          if (!empty($user->fullname)) {
              $fullName = $user->fullname;
          }
      }

      $userEmail = $user->email ?? 'Not specified';
      $currentDateTime = Carbon::now()->format('F j, Y \a\t g:i A');
      $expiryDateTime = Carbon::now()->addHours(24)->format('F j, Y \a\t g:i A');
      $adminResetToken = Str::random(60);

      DB::table('users')
          ->where('id', $user->id)
          ->update([
              'reset_password_token' => $adminResetToken,
              'reset_token_expires_at' => Carbon::now()->addHours(24),
              'updated_at' => DB::raw('updated_at'),
          ]);

      // ✅ Get frontend URL from config
      $frontendUrl = config('app.frontend_url', 'http://localhost:3039');
      $resetLink = "{$frontendUrl}/password-reset?token={$adminResetToken}&username={$user->username}&level=2";

      $companyName = $this->getCompanyName();

      $emailBody = <<<TXT
          Good day!

          Please reset my password for my account in SchoolMANAGER system.

          Request Details:
          Account Name: {$fullName}
          Email: {$userEmail}
          Request Time: {$currentDateTime}
          Link Expires: {$expiryDateTime} (24 hours from request)

          Please use this link to reset my password (valid for 24 hours):
          
          {$resetLink}

          Thank you!
          {$fullName}

          ***This is an automated notification from the SchoolMANAGER system.***

          This e-mail transmission is intended only for the addressee and may contain confidential information. Confidentiality is not waived if you are not the intended recipient of this e-mail, nor may you use, review, disclose, disseminate or copy any information contained in or attached to it. If you received this e-mail in error please delete it and any attachments and notify us immediately by reply e-mail. $companyName does not warrant that any attachments are free from viruses or other defects. You assume all liability for any loss, damage or other consequences which may arise from opening or using the attachments.
      TXT;

      try {
          Mail::raw($emailBody, function ($message) use ($user, $fullName) {
              $message->to($user->assigned_admin_email)
                  ->subject('Password Reset Assistance Request - ' . $fullName);
          });
      } catch (\Exception $e) {
          Log::error('Failed to send assistance request email', [
              'user_id' => $user->id,
              'error' => $e->getMessage()
          ]);

          return response()->json([
              'success' => false,
              'status' => 500,
              'message' => 'Failed to send assistance request.',
              'error' => $e->getMessage(),
          ], 500);
      }

      return response()->json([
          'success' => true,
          'status' => 200,
          'message' => 'Your request for password reset assistance was sent successfully. Your request is valid for 24 hours. The school administrator will contact you soon.',
          'data' => [
              'username' => $user->username,
              'assigned_admin_email' => $user->assigned_admin_email,
          ],
      ], 200);
  }
}