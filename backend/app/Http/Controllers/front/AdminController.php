<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Course;
use App\Models\enrollment;

class AdminController extends Controller
{
    // Global admin dashboard stats
    public function dashboard()
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalCourses = Course::count();
        $totalEnrollments = enrollment::count();
        $totalRevenue = DB::table('enrollments')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->sum('courses.price');

        // Recent enrollments
        $recentEnrollments = DB::table('enrollments')
            ->join('users', 'users.id', '=', 'enrollments.user_id')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->select('users.name as student_name', 'users.email', 'courses.title as course_title', 'enrollments.created_at')
            ->orderBy('enrollments.created_at', 'DESC')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 200,
            'total_students' => $totalStudents,
            'total_courses' => $totalCourses,
            'total_enrollments' => $totalEnrollments,
            'total_revenue' => $totalRevenue,
            'recent_enrollments' => $recentEnrollments,
        ]);
    }

    // List all students with enrollment counts
    public function students()
    {
        $students = User::where('role', 'student')
            ->withCount('enrollments')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->map(function ($s) {
                // Calculate avg progress across all enrolled courses
                $enrolledCourseIds = DB::table('enrollments')->where('user_id', $s->id)->pluck('course_id');
                $totalLessons = 0;
                $completedLessons = 0;

                foreach ($enrolledCourseIds as $courseId) {
                    $chapterIds = DB::table('lessons')->where('course_id', $courseId)->pluck('id');
                    $courseTotalLessons = DB::table('chapters')->whereIn('chapter_id', $chapterIds)->count();
                    $courseCompletedLessons = DB::table('progress')
                        ->where('user_id', $s->id)
                        ->where('course_id', $courseId)
                        ->where('is_completed', 'yes')
                        ->count();

                    $totalLessons += $courseTotalLessons;
                    $completedLessons += $courseCompletedLessons;
                }

                $s->avg_progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;
                return $s;
            });

        return response()->json([
            'status' => 200,
            'data' => $students,
        ]);
    }

    // View a specific student's progress
    public function studentProgress($userId)
    {
        $student = User::find($userId);
        if (!$student || $student->role !== 'student') {
            return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
        }

        $enrollments = DB::table('enrollments')
            ->where('enrollments.user_id', $userId)
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->leftJoin('categories', 'categories.id', '=', 'courses.category_id')
            ->select('courses.*', 'categories.name as category_name', 'enrollments.created_at as enrolled_at')
            ->get();

        $courses = $enrollments->map(function ($course) use ($userId) {
            $chapterIds = DB::table('lessons')->where('course_id', $course->id)->pluck('id');
            $totalLessons = DB::table('chapters')->whereIn('chapter_id', $chapterIds)->count();
            $completedLessons = DB::table('progress')
                ->where('user_id', $userId)
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
            'student' => $student,
            'courses' => $courses,
        ]);
    }

    // Admin updates student email/password
    public function updateStudent(Request $request, $userId)
    {
        $student = User::find($userId);
        if (!$student || $student->role !== 'student') {
            return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
        }

        $request->merge([
            'email' => strtolower(trim($request->email)),
        ]);

        $request->validate([
            'email' => 'required|email:rfc,dns|unique:users,email,' . $userId,
            'password' => ['nullable', \Illuminate\Validation\Rules\Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
        ]);

        $oldEmail = $student->email;
        $newEmail = $request->email;

        if ($oldEmail !== $newEmail) {
            \Illuminate\Support\Facades\Log::info("Admin updated user ID {$userId} email from [{$oldEmail}] to [{$newEmail}]");
        }

        $student->email = $newEmail;
        if ($request->password) {
            $student->password = \Illuminate\Support\Facades\Hash::make($request->password);
            \Illuminate\Support\Facades\Log::info("Admin updated user ID {$userId} password.");
        }
        $student->save();

        return response()->json([
            'status' => 200,
            'message' => 'Student updated successfully',
        ]);
    }
}
