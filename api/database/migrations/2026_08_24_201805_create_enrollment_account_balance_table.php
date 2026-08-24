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
        Schema::create('enrollment_account_balance', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // User and school identification
            $table->string('userid', 20)->nullable();
            $table->string('school_code', 20)->nullable();
            
            // Student information
            $table->string('student_id', 20)->nullable();
            $table->string('student_name', 255)->nullable();
            $table->string('enrollment_number', 20)->nullable();
            $table->string('level', 50)->nullable();
            $table->string('section_course', 50)->nullable();
            
            // Academic details
            $table->string('school_year', 20)->nullable();
            $table->string('school_term', 20)->nullable();
            
            // Financial details
            $table->date('transaction_date')->nullable();
            $table->decimal('original_amount', 20, 2)->default(0.00);
            $table->decimal('paid_amount', 20, 2)->default(0.00);
            $table->decimal('account_balance', 20, 2)->default(0.00);
            
            // Payment tracking
            $table->date('last_payment_date')->nullable();
            $table->string('last_reference_number', 20)->nullable();
            
            // Status
            $table->enum('status', ['active', 'deleted'])->default('active');

            // Timestamps
            $table->timestamps();

            // ============================================================
            // INDEXES for performance optimization
            // ============================================================
            
            // Single column indexes
            $table->index('userid');
            $table->index('student_id');
            $table->index('school_code');
            $table->index('school_year');
            $table->index('status');
            $table->index('enrollment_number');
            $table->index('level');
            $table->index('section_course');
            $table->index('school_term');
            
            // Composite indexes for common queries
            $table->index(['school_code', 'student_id']);
            $table->index(['school_code', 'school_year', 'status']);
            $table->index(['school_year', 'school_term']);
            $table->index(['level', 'section_course']);
            $table->index(['student_id', 'school_year']);
            
            // Index for financial queries
            $table->index(['account_balance', 'status']);
            
            // Index for date range queries
            $table->index('transaction_date');
            $table->index('last_payment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_account_balance');
    }
};