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
        Schema::create('monthly_account_balance', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // User and school identification
            $table->string('userid', 20)->nullable();
            $table->string('school_code', 20)->nullable();
            
            // Student information
            $table->string('student_id', 20)->nullable();
            $table->string('student_name', 255)->nullable();
            $table->date('enrollment_date')->nullable();
            $table->string('enrollment_number', 20)->nullable();
            $table->string('level', 50)->nullable();
            $table->string('section_course', 50)->nullable();
            
            // Academic details
            $table->string('school_year', 20)->nullable();
            $table->string('school_term', 20)->nullable();
            $table->string('payment_mode', 20)->default('MONTHLY');
            
            // Month 1
            $table->date('month_1_duedate')->nullable();
            $table->decimal('month_1_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_1_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_1_account_balance', 20, 2)->default(0.00);
            $table->enum('month_1_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 2
            $table->date('month_2_duedate')->nullable();
            $table->decimal('month_2_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_2_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_2_account_balance', 20, 2)->default(0.00);
            $table->enum('month_2_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 3
            $table->date('month_3_duedate')->nullable();
            $table->decimal('month_3_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_3_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_3_account_balance', 20, 2)->default(0.00);
            $table->enum('month_3_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 4
            $table->date('month_4_duedate')->nullable();
            $table->decimal('month_4_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_4_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_4_account_balance', 20, 2)->default(0.00);
            $table->enum('month_4_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 5
            $table->date('month_5_duedate')->nullable();
            $table->decimal('month_5_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_5_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_5_account_balance', 20, 2)->default(0.00);
            $table->enum('month_5_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 6
            $table->date('month_6_duedate')->nullable();
            $table->decimal('month_6_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_6_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_6_account_balance', 20, 2)->default(0.00);
            $table->enum('month_6_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 7
            $table->date('month_7_duedate')->nullable();
            $table->decimal('month_7_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_7_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_7_account_balance', 20, 2)->default(0.00);
            $table->enum('month_7_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 8
            $table->date('month_8_duedate')->nullable();
            $table->decimal('month_8_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_8_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_8_account_balance', 20, 2)->default(0.00);
            $table->enum('month_8_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 9
            $table->date('month_9_duedate')->nullable();
            $table->decimal('month_9_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_9_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_9_account_balance', 20, 2)->default(0.00);
            $table->enum('month_9_status', ['paid', 'overdue'])->default('overdue');
            
            // Month 10
            $table->date('month_10_duedate')->nullable();
            $table->decimal('month_10_orig_amount', 20, 2)->default(0.00);
            $table->decimal('month_10_paid_amount', 20, 2)->default(0.00);
            $table->decimal('month_10_account_balance', 20, 2)->default(0.00);
            $table->enum('month_10_status', ['paid', 'overdue'])->default('overdue');
            
            // Status
            $table->enum('status', ['active', 'deleted'])->default('active');

            // Timestamps
            $table->timestamps();

            // ============================================================
            // INDEXES
            // ============================================================
            $table->index('userid');
            $table->index('student_id');
            $table->index('school_code');
            $table->index('school_year');
            $table->index('status');
            $table->index('enrollment_number');
            $table->index('level');
            $table->index('section_course');
            $table->index('school_term');
            $table->index('payment_mode');
            
            // Composite indexes
            $table->index(['school_code', 'student_id']);
            $table->index(['school_code', 'school_year', 'status']);
            $table->index(['student_id', 'school_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_account_balance');
    }
};