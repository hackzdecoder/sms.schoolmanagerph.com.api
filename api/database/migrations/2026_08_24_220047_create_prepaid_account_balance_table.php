<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prepaid_account_balance', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // User and school identification
            $table->string('user_id', 20)->nullable();
            $table->string('school_code', 20)->nullable();
            
            // Student information
            $table->string('student_id', 20)->nullable();
            $table->string('student_name', 255)->nullable();
            
            // Prepaid balance details
            $table->decimal('prepaid_balance', 20, 2)->default(0.00);
            
            // Payment tracking
            $table->date('last_reload_date')->nullable();
            $table->string('last_reference_number', 20)->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Status
            $table->enum('status', ['active', 'deleted'])->default('active');

            // ============================================================
            // INDEXES
            // ============================================================
            $table->index('user_id');
            $table->index('student_id');
            $table->index('school_code');
            $table->index('status');
            
            // Composite indexes
            $table->index(['school_code', 'student_id']);
            $table->index(['school_code', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prepaid_account_balance');
    }
};