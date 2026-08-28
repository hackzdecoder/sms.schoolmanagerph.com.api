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
        Schema::create('payment_transactions', function (Blueprint $table) {
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
            
            // Payment details
            $table->string('payment_method', 255)->nullable();
            $table->string('payment_description', 255)->nullable();
            $table->decimal('payment_amount', 20, 2)->default(0.00);
            $table->dateTime('payment_date')->nullable();
            $table->string('transaction_reference', 20)->nullable();
            $table->string('cashier', 255)->nullable();
            
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
            $table->index('payment_method');
            $table->index('payment_date');
            $table->index('transaction_reference');
            
            // Composite indexes
            $table->index(['school_code', 'student_id']);
            $table->index(['school_code', 'status']);
            $table->index(['student_id', 'payment_date']);
            $table->index(['payment_method', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};