<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->decimal('login_latitude', 10, 7)->nullable()->after('login_time');
            $table->decimal('login_longitude', 10, 7)->nullable()->after('login_latitude');
            $table->decimal('logout_latitude', 10, 7)->nullable()->after('logout_time');
            $table->decimal('logout_longitude', 10, 7)->nullable()->after('logout_latitude');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['login_latitude', 'login_longitude', 'logout_latitude', 'logout_longitude']);
        });
    }
};
