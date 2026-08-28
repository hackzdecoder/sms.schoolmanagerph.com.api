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
        Schema::create('other_fees_account_balance', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // User and school identification
            $table->string('user_id', 20)->nullable();
            $table->string('school_code', 20)->nullable();
            
            // Student information
            $table->string('student_id', 20)->nullable();
            $table->string('student_name', 255)->nullable();
            $table->string('level', 50)->nullable();
            $table->string('section_course', 50)->nullable();
            
            // Academic details
            $table->string('school_year', 20)->nullable();
            $table->string('school_term', 20)->nullable();
            
            // Fee details
            $table->date('transaction_date')->nullable();
            $table->string('fee_name', 100)->nullable();
            
            // Financial details
            $table->decimal('orig_amount', 20, 2)->default(0.00);
            $table->decimal('discount', 20, 2)->default(0.00);
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
            // INDEXES
            // ============================================================
            $table->index('user_id');
            $table->index('student_id');
            $table->index('school_code');
            $table->index('school_year');
            $table->index('status');
            $table->index('level');
            $table->index('section_course');
            $table->index('school_term');
            $table->index('fee_name');
            
            // Composite indexes
            $table->index(['school_code', 'student_id']);
            $table->index(['school_code', 'school_year', 'status']);
            $table->index(['student_id', 'school_year']);
            $table->index(['fee_name', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('other_fees_account_balance');
    }
};