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
        Schema::create('prepaid_account_transactions', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // User and school identification
            $table->string('userid', 20)->nullable();
            $table->string('school_code', 20)->nullable();
            
            // Student information
            $table->string('student_id', 20)->nullable();
            $table->string('student_name', 255)->nullable();
            
            // Academic details
            $table->string('school_year', 20)->nullable();
            $table->string('school_term', 20)->nullable();
            
            // Transaction details
            $table->string('transaction_type', 50)->nullable();
            $table->string('item_description', 255)->nullable();
            $table->decimal('item_amount', 20, 2)->default(0.00);
            $table->decimal('post_prepaid_balance', 20, 2)->default(0.00);
            
            // Transaction tracking
            $table->dateTime('transaction_date')->nullable();
            $table->string('transaction_reference', 20)->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Status
            $table->enum('status', ['active', 'deleted'])->default('active');

            // ============================================================
            // INDEXES
            // ============================================================
            $table->index('userid');
            $table->index('student_id');
            $table->index('school_code');
            $table->index('school_year');
            $table->index('status');
            $table->index('transaction_type');
            $table->index('transaction_date');
            
            // Composite indexes
            $table->index(['school_code', 'student_id']);
            $table->index(['school_code', 'status']);
            $table->index(['student_id', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prepaid_account_transactions');
    }
};