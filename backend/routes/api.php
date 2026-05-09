<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\CourseOutcomeController;
use App\Http\Controllers\front\CourseRequirementController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\PublicCourseController;
use App\Http\Controllers\front\ProgressController;
use App\Http\Controllers\front\ReviewController;
use App\Http\Controllers\front\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Public (no auth) ───
Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::get('/public/courses/featured', [PublicCourseController::class, 'featured']);
Route::get('/public/courses', [PublicCourseController::class, 'index']);
Route::get('/public/courses/{id}', [PublicCourseController::class, 'show']);
Route::get('/public/filters', [PublicCourseController::class, 'filters']);

// ─── Shared auth routes (both admin + student) ───
Route::group(["middleware" => ["auth:sanctum"]], function () {
    Route::put('/profile', [AccountController::class, 'updateProfile']);
    Route::put('/change-password', [AccountController::class, 'changePassword']);
    Route::get('/dashboard-stats', [AccountController::class, 'dashboardStats']);
});

// ─── Admin-only routes ───
Route::group(["middleware" => ["auth:sanctum", "role:admin"]], function () {
    // Course management
    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::get('/course-dropdowns', [CourseController::class, 'dropdowns']);
    Route::post('/courses/{id}/update-image', [CourseController::class, 'updateImage']);
    Route::post('/courses/{id}/toggle-publish', [CourseController::class, 'togglePublish']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Course Outcomes
    Route::get('/courses/{courseId}/outcomes', [CourseOutcomeController::class, 'index']);
    Route::post('/courses/{courseId}/outcomes', [CourseOutcomeController::class, 'store']);
    Route::put('/outcomes/{id}', [CourseOutcomeController::class, 'update']);
    Route::delete('/outcomes/{id}', [CourseOutcomeController::class, 'destroy']);
    Route::post('/outcomes/sort', [CourseOutcomeController::class, 'sort']);

    // Course Requirements
    Route::get('/courses/{courseId}/requirements', [CourseRequirementController::class, 'index']);
    Route::post('/courses/{courseId}/requirements', [CourseRequirementController::class, 'store']);
    Route::put('/requirements/{id}', [CourseRequirementController::class, 'update']);
    Route::delete('/requirements/{id}', [CourseRequirementController::class, 'destroy']);
    Route::post('/requirements/sort', [CourseRequirementController::class, 'sort']);

    // Chapters (sections)
    Route::get('/courses/{courseId}/chapters', [ChapterController::class, 'index']);
    Route::post('/courses/{courseId}/chapters', [ChapterController::class, 'store']);
    Route::put('/chapters/{id}', [ChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [ChapterController::class, 'destroy']);
    Route::post('/chapters/sort', [ChapterController::class, 'sort']);

    // Lessons (within chapters)
    Route::get('/chapters/{chapterId}/lessons', [LessonController::class, 'index']);
    Route::post('/chapters/{chapterId}/lessons', [LessonController::class, 'store']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::post('/lessons/sort', [LessonController::class, 'sort']);
    Route::post('/lessons/{id}/upload-video', [LessonController::class, 'uploadVideo']);

    // Admin dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/students', [AdminController::class, 'students']);
    Route::get('/admin/students/{userId}/progress', [AdminController::class, 'studentProgress']);
    Route::put('/admin/students/{userId}', [AdminController::class, 'updateStudent']);
});

// ─── Student-only routes ───
Route::group(["middleware" => ["auth:sanctum", "role:student"]], function () {
    // Enrollment
    Route::post('/enroll/{courseId}', [PublicCourseController::class, 'enroll']);
    Route::get('/check-enrollment/{courseId}', [PublicCourseController::class, 'checkEnrollment']);
    Route::get('/enrolled-courses', [PublicCourseController::class, 'enrolledCourses']);

    // Progress
    Route::post('/progress/complete/{lessonId}', [ProgressController::class, 'markComplete']);
    Route::get('/progress/course/{courseId}', [ProgressController::class, 'courseProgress']);
    Route::get('/progress/my', [ProgressController::class, 'myProgress']);

    // Reviews
    Route::post('/reviews/{courseId}', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
});