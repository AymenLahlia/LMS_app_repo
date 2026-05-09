<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample users for reviews
        $reviewerIds = [];
        $reviewers = [
            ['name' => 'Melchizedek Amos', 'email' => 'melchi@example.com'],
            ['name' => 'Dao Duy Quyennn', 'email' => 'dao@example.com'],
            ['name' => 'jerrygrex', 'email' => 'jerry@example.com'],
            ['name' => 'Recelyn Veracion', 'email' => 'recelyn@example.com'],
            ['name' => 'Ravil', 'email' => 'ravil@example.com'],
            ['name' => 'osam', 'email' => 'osam@example.com'],
        ];
        foreach ($reviewers as $r) {
            $existing = DB::table('users')->where('email', $r['email'])->first();
            if ($existing) {
                $reviewerIds[] = $existing->id;
            } else {
                $id = DB::table('users')->insertGetId([
                    'name' => $r['name'],
                    'email' => $r['email'],
                    'password' => Hash::make('password123'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $reviewerIds[] = $id;
            }
        }

        // Get the first real user as course owner
        $owner = DB::table('users')->first();
        $ownerId = $owner ? $owner->id : $reviewerIds[0];

        // Category, Level, Language IDs
        $catWebDev = DB::table('categories')->where('name', 'Web Development')->value('id');
        $catFinance = DB::table('categories')->where('name', 'Finance')->value('id');
        $catMarketing = DB::table('categories')->where('name', 'Marketing')->value('id');
        $catBusiness = DB::table('categories')->where('name', 'Business')->value('id');
        $catMusic = DB::table('categories')->where('name', 'Music')->value('id');
        $catPhoto = DB::table('categories')->where('name', 'Photography')->value('id');

        $lvlBeginner = DB::table('levels')->where('name', 'Beginner')->value('id');
        $lvlIntermediate = DB::table('levels')->where('name', 'Intermediate')->value('id');
        $lvlExpert = DB::table('levels')->where('name', 'Expert')->value('id');

        $langEnglish = DB::table('languages')->where('name', 'English')->value('id');
        $langFrench = DB::table('languages')->where('name', 'French')->value('id');

        // Sample courses
        $courses = [
            [
                'title' => 'Laravel From Scratch – Beginner to Master',
                'description' => '<p>Learn Laravel from the ground up and become a proficient PHP developer! This course covers everything from setting up Laravel to building real-world applications. You\'ll master routing, authentication, database management, API development, and advanced Laravel features.</p>',
                'price' => 10,
                'cross_price' => 8,
                'category_id' => $catWebDev,
                'level_id' => $lvlIntermediate,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Complete React.js Course 2026',
                'description' => '<p>Master React.js from zero to hero. Learn components, hooks, state management, routing, and build production-ready applications with modern best practices.</p>',
                'price' => 15,
                'cross_price' => 25,
                'category_id' => $catWebDev,
                'level_id' => $lvlBeginner,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Personal Finance Masterclass',
                'description' => '<p>Take control of your finances! Learn budgeting, investing, debt management, and building wealth. Perfect for beginners who want to understand money management.</p>',
                'price' => 20,
                'cross_price' => 35,
                'category_id' => $catFinance,
                'level_id' => $lvlBeginner,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Digital Marketing Strategy',
                'description' => '<p>Learn how to create effective digital marketing campaigns. Covers SEO, social media marketing, email marketing, content strategy, and analytics.</p>',
                'price' => 12,
                'cross_price' => 20,
                'category_id' => $catMarketing,
                'level_id' => $lvlIntermediate,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Node.js & Express – Complete Guide',
                'description' => '<p>Build scalable backend applications with Node.js and Express. Learn RESTful API design, authentication, database integration, and deployment.</p>',
                'price' => 18,
                'cross_price' => 30,
                'category_id' => $catWebDev,
                'level_id' => $lvlIntermediate,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Business Analytics with Python',
                'description' => '<p>Learn data analysis and visualization using Python. Master pandas, matplotlib, and real-world business analytics techniques.</p>',
                'price' => 22,
                'cross_price' => 40,
                'category_id' => $catBusiness,
                'level_id' => $lvlExpert,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Music Production Fundamentals',
                'description' => '<p>Start making music today! Learn the fundamentals of music production, mixing, mastering, and sound design using modern DAW software.</p>',
                'price' => 14,
                'cross_price' => 25,
                'category_id' => $catMusic,
                'level_id' => $lvlBeginner,
                'language_id' => $langFrench,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
            [
                'title' => 'Photography for Beginners',
                'description' => '<p>Learn the art of photography from composition to editing. Master your camera settings, lighting techniques, and post-processing workflows.</p>',
                'price' => 9,
                'cross_price' => 15,
                'category_id' => $catPhoto,
                'level_id' => $lvlBeginner,
                'language_id' => $langEnglish,
                'status' => 1,
                'is_featured' => 'yes',
                'user_id' => $ownerId,
            ],
        ];

        foreach ($courses as $courseData) {
            $existingCourse = DB::table('courses')->where('title', $courseData['title'])->first();
            if ($existingCourse) continue;

            $courseId = DB::table('courses')->insertGetId(array_merge($courseData, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));

            // Add chapters (sections) to lessons table
            $chapterTitles = [
                'Module 1: Introduction',
                'Module 2: Core Concepts',
                'Module 3: Advanced Topics',
            ];

            foreach ($chapterTitles as $idx => $chTitle) {
                $chapterId = DB::table('lessons')->insertGetId([
                    'course_id' => $courseId,
                    'title' => $chTitle,
                    'sort_order' => $idx + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Add lessons to chapters table
                $lessonTitles = [
                    'Getting Started',
                    'Key Concepts',
                    'Hands-on Practice',
                ];

                foreach ($lessonTitles as $lIdx => $lTitle) {
                    DB::table('chapters')->insert([
                        'chapter_id' => $chapterId,
                        'title' => $lTitle,
                        'sort_order' => $lIdx + 1,
                        'duration' => rand(5, 25),
                        'status' => 1,
                        'is_free_preview' => $lIdx === 0 ? 'yes' : 'no',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Add outcomes
            $outcomes = [
                'Understand core concepts and fundamentals',
                'Build real-world projects from scratch',
                'Apply best practices in professional environments',
            ];
            foreach ($outcomes as $oIdx => $text) {
                DB::table('outcomes')->insert([
                    'course_id' => $courseId,
                    'text' => $text,
                    'sort_order' => $oIdx + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Add requirements
            $reqs = [
                'Basic computer skills',
                'No prior experience needed',
            ];
            foreach ($reqs as $rIdx => $text) {
                DB::table('requirements')->insert([
                    'course_id' => $courseId,
                    'text' => $text,
                    'sort_order' => $rIdx + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Add reviews
            $reviewTexts = [
                ['rating' => 5, 'comment' => 'awesome'],
                ['rating' => 5, 'comment' => 'oke'],
                ['rating' => 3, 'comment' => 'zfs'],
                ['rating' => 3, 'comment' => 'donw know'],
                ['rating' => 5, 'comment' => 'test'],
                ['rating' => 2, 'comment' => 'good'],
            ];

            $shuffledReviewers = $reviewerIds;
            shuffle($shuffledReviewers);
            $numReviews = rand(3, count($reviewTexts));

            for ($i = 0; $i < $numReviews; $i++) {
                DB::table('reviews')->insert([
                    'user_id' => $shuffledReviewers[$i % count($shuffledReviewers)],
                    'course_id' => $courseId,
                    'rating' => $reviewTexts[$i]['rating'],
                    'comment' => $reviewTexts[$i]['comment'],
                    'status' => 1,
                    'created_at' => now()->subDays(rand(1, 180)),
                    'updated_at' => now(),
                ]);
            }

            // Add some enrollments
            $numEnrollments = rand(10, 50);
            $enrolledUsers = array_slice($shuffledReviewers, 0, min($numEnrollments, count($shuffledReviewers)));
            foreach ($enrolledUsers as $uid) {
                $exists = DB::table('enrollments')->where('user_id', $uid)->where('course_id', $courseId)->exists();
                if (!$exists) {
                    DB::table('enrollments')->insert([
                        'user_id' => $uid,
                        'course_id' => $courseId,
                        'created_at' => now()->subDays(rand(1, 90)),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
