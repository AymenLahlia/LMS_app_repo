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
        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->string('profile_pic')->nullable()->after('phone');
            $table->string('language')->nullable();
            $table->string('nationality')->nullable();
            $table->string('gender')->nullable();
            $table->date('birthday')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('terms_accepted')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'last_name', 'phone', 'profile_pic', 'language', 
                'nationality', 'gender', 'birthday', 'bio', 'terms_accepted'
            ]);
        });
    }
};
