<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'employee'])->default('employee')->after('email');
            $table->string('employee_code')->nullable()->unique()->after('role');
            $table->string('phone', 20)->nullable()->after('employee_code');
            $table->string('department')->nullable()->after('phone');
            $table->string('designation')->nullable()->after('department');
            $table->date('date_of_joining')->nullable()->after('designation');
            $table->boolean('is_active')->default(true)->after('date_of_joining');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'employee_code',
                'phone',
                'department',
                'designation',
                'date_of_joining',
                'is_active',
            ]);
        });
    }
};
