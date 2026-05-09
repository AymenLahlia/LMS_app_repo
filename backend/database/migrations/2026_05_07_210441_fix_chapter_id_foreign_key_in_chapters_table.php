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
        Schema::table('chapters', function (Blueprint $table) {
            // Drop the self-referencing FK
            $table->dropForeign(['chapter_id']);

            // Re-add FK pointing to the lessons table (which stores chapters/sections)
            $table->foreign('chapter_id')->references('id')->on('lessons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropForeign(['chapter_id']);
            $table->foreign('chapter_id')->references('id')->on('chapters')->onDelete('cascade');
        });
    }
};
