<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DropdownSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $categories = [
            'Web Development',
            'Finance',
            'Personal Development',
            'Marketing',
            'Music',
            'Business',
            'Health & Fitness',
            'Photography',
        ];

        foreach ($categories as $name) {
            DB::table('categories')->updateOrInsert(
                ['name' => $name],
                ['name' => $name, 'status' => 1, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // Levels
        $levels = ['Beginner', 'Intermediate', 'Expert'];

        foreach ($levels as $name) {
            DB::table('levels')->updateOrInsert(
                ['name' => $name],
                ['name' => $name, 'status' => 1, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // Languages
        $languages = ['English', 'Italian', 'French', 'German'];

        foreach ($languages as $name) {
            DB::table('languages')->updateOrInsert(
                ['name' => $name],
                ['name' => $name, 'status' => 1, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
