<?php
namespace App\Http\Controllers\api\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PasswordController extends Controller
{
    public function validateResetLink(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'token' => 'required|string',
            'school_code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'status' => 422,
                'valid' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // ✅ Fix: Include token in the query
        $query = User::where('username', $request->username)
            ->where('reset_password_token', $request->token);
        
        if ($request->has('school_code') && !empty($request->school_code)) {
            $query->where('school_code', $request->school_code);
        }
        
        $user = $query->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'status' => 401,
                'valid' => false,
                'message' => 'Invalid reset token or user not found.',
            ], 401);
        }

        // ✅ Check if token is NULL (already used)
        if (!$user->reset_password_token) {
            return response()->json([
                'success' => false,
                'status' => 410,
                'valid' => false,
                'message' => 'Reset token has already been used.',
                'reset_level' => $request->get('level') ? intval($request->get('level')) : 1
            ], 410);
        }

        // ✅ Check if token has expired
        $now = Carbon::now();
        $expiresAt = Carbon::parse($user->reset_token_expires_at);
    

        if ($now->gt($expiresAt)) {
            return response()->json([
                'success' => false,
                'status' => 410,
                'valid' => false,
                'message' => 'Reset token has expired.',
                'reset_level' => $request->get('level') ? intval($request->get('level')) : 1,
                'debug' => [
                    'expires_at' => $expiresAt->toDateTimeString(),
                    'current_time' => $now->toDateTimeString(),
                ]
            ], 410);
        }

        // ✅ Get fullname
        $fullname = $user->fullname ?? $user->username;

        return response()->json([
            'success' => true,
            'status' => 200,
            'valid' => true,
            'message' => 'Reset token is valid.',
            'data' => [
                'reset_token_expires_at' => $expiresAt->toDateTimeString(),
                'fullname' => $fullname,
            ]
        ], 200);
    }

    public function resetPasswordUpdate(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'token' => 'required|string',
            'new_password' => 'required|min:8|confirmed',
            'new_password_confirmation' => 'required',
            'password_update_by' => 'required|in:1,2',
            'school_code' => 'nullable|string',
        ], [
            'password_update_by.in' => 'Invalid password update level. Must be 1 (Self-service) or 2 (Admin-assisted).',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'status' => 422,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // ✅ Fix: Include token in the query
        $query = User::where('username', $request->username)
            ->where('reset_password_token', $request->token);
        
        if ($request->has('school_code') && !empty($request->school_code)) {
            $query->where('school_code', $request->school_code);
        }
        
        $user = $query->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'status' => 401,
                'message' => 'Invalid reset token or user not found.',
            ], 401);
        }

        // ✅ Check if token has expired
        $now = Carbon::now();
        $expiresAt = Carbon::parse($user->reset_token_expires_at);
        
        if ($now->gt($expiresAt)) {
            return response()->json([
                'success' => false,
                'status' => 410,
                'message' => 'Reset token has expired.',
            ], 410);
        }

        $passwordUpdateBy = $request->password_update_by;

        DB::table('users')
            ->where('id', $user->id)
            ->update([
                'password' => Hash::make($request->new_password),
                'password_update_by' => $passwordUpdateBy,
                'reset_password_token' => null,
                'reset_token_expires_at' => null,
                'otp_verified_at' => null,
                'updated_at' => Carbon::now(),
            ]);

        // Only return Google redirect for LEVEL 2
        if ($passwordUpdateBy == 2) {
            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Password Reset was successful, please give the new password to the user who requested the reset.',
                'redirect_url' => 'https://www.google.com/',
                'is_external_redirect' => true,
                'reset_level' => 2
            ], 200);
        }

        return response()->json([
            'success' => true,
            'status' => 200,
            'message' => 'Password Reset was successful',
            'reset_level' => 1
        ], 200);
    }

    /**
     * Update password for authenticated users
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
            'new_password_confirmation' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'status' => 422,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'status' => 401,
                'message' => 'Current password is incorrect.',
            ], 401);
        }

        // Verify new password is different from current password
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'success' => false,
                'status' => 422,
                'message' => 'New password must be different from current password.',
                'errors' => ['new_password' => ['New password must be different from current password.']],
            ], 422);
        }

        // Update password
        DB::table('users')
            ->where('id', $user->id)
            ->update([
                'password' => Hash::make($request->new_password),
                'password_update_by' => 1,
                'updated_at' => Carbon::now(),
            ]);

        return response()->json([
            'success' => true,
            'status' => 200,
            'message' => 'Password updated successfully.',
        ], 200);
    }
}