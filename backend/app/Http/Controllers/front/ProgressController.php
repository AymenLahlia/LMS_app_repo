<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    // Student marks a lesson as complete
    public function markComplete($lessonId)
    {
        $user = auth()->user();

        // Get the lesson (from chapters table) and its parent chapter (from lessons table)
        $lesson = DB::table('chapters')->where('id', $lessonId)->first();
        if (!$lesson) {
            return response()->json(['status' => 404, 'message' => 'Lesson not found'], 404);
        }

        // Get the chapter to find the course_id
        $chapter = DB::table('lessons')->where('id', $lesson->chapter_id)->first();
        if (!$chapter) {
            return response()->json(['status' => 404, 'message' => 'Chapter not found'], 404);
        }

        // Check student is enrolled
        $enrolled = DB::table('enrollments')
            ->where('user_id', $user->id)
            ->where('course_id', $chapter->course_id)
            ->exists();

        if (!$enrolled) {
            return response()->json(['status' => 403, 'message' => 'Not enrolled in this course'], 403);
        }

        // Upsert progress
        $existing = DB::table('progress')
            ->where('user_id', $user->id)
            ->where('course_id', $chapter->course_id)
            ->where('lesson_id', $lessonId)
            ->first();

        if ($existing) {
            $newStatus = $existing->is_completed === 'yes' ? 'no' : 'yes';
            DB::table('progress')->where('id', $existing->id)->update([
                'is_completed' => $newStatus,
                'completed_at' => $newStatus === 'yes' ? now() : null,
                'updated_at' => now(),
            ]);
        } else {
            DB::table('progress')->insert([
                'user_id' => $user->id,
                'course_id' => $chapter->course_id,
                'lesson_id' => $lessonId,
                'is_completed' => 'yes',
                'completed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['status' => 200, 'message' => 'Progress updated']);
    }

    // Get student's progress for a specific course
    public function courseProgress($courseId)
    {
        $user = auth()->user();

        // Total lessons in course
        $chapterIds = DB::table('lessons')->where('course_id', $courseId)->pluck('id');
        $totalLessons = DB::table('chapters')->whereIn('chapter_id', $chapterIds)->count();

        // Completed lessons
        $completedLessons = DB::table('progress')
            ->where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->where('is_completed', 'yes')
            ->count();

        $completedIds = DB::table('progress')
            ->where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->where('is_completed', 'yes')
            ->pluck('lesson_id');

        $percentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

        return response()->json([
            'status' => 200,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'percentage' => $percentage,
            'completed_ids' => $completedIds,
        ]);
    }

    // Get all enrolled courses with progress
    public function myProgress()
    {
        $user = auth()->user();

        $enrollments = DB::table('enrollments')
            ->where('enrollments.user_id', $user->id)
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->leftJoin('categories', 'categories.id', '=', 'courses.category_id')
            ->select('courses.*', 'categories.name as category_name', 'enrollments.created_at as enrolled_at')
            ->get();

        $result = $enrollments->map(function ($course) use ($user) {
            $chapterIds = DB::table('lessons')->where('course_id', $course->id)->pluck('id');
            $totalLessons = DB::table('chapters')->whereIn('chapter_id', $chapterIds)->count();
            $completedLessons = DB::table('progress')
                ->where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->where('is_completed', 'yes')
                ->count();

            $course->total_lessons = $totalLessons;
            $course->completed_lessons = $completedLessons;
            $course->progress_percentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

            return $course;
        });

        return response()->json([
            'status' => 200,
            'data' => $result,
        ]);
    }
}
