<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\enrollment;
use App\Models\lesson;
use App\Models\chapter;
use App\Models\outcome;
use App\Models\requirement;
use App\Models\Category;
use App\Models\level;
use App\Models\language;
use Illuminate\Http\Request;

class PublicCourseController extends Controller
{
    // Featured courses (published + is_featured=yes)
    public function featured()
    {
        $courses = Course::where('status', 1)
            ->where('is_featured', 'yes')
            ->withCount('enrollments')
            ->with('category', 'level', 'language')
            ->orderBy('created_at', 'DESC')
            ->limit(8)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $courses,
        ]);
    }

    // All published courses with filters
    public function index(Request $request)
    {
        $query = Course::where('status', 1)
            ->withCount('enrollments')
            ->with('category', 'level', 'language');

        // Search
        if ($request->has('keyword') && $request->keyword) {
            $query->where('title', 'like', '%' . $request->keyword . '%');
        }

        // Category filter
        if ($request->has('category_id') && $request->category_id) {
            $ids = is_array($request->category_id) ? $request->category_id : explode(',', $request->category_id);
            $query->whereIn('category_id', $ids);
        }

        // Level filter
        if ($request->has('level_id') && $request->level_id) {
            $ids = is_array($request->level_id) ? $request->level_id : explode(',', $request->level_id);
            $query->whereIn('level_id', $ids);
        }

        // Language filter
        if ($request->has('language_id') && $request->language_id) {
            $ids = is_array($request->language_id) ? $request->language_id : explode(',', $request->language_id);
            $query->whereIn('language_id', $ids);
        }

        // Sort
        if ($request->sort == '1') {
            $query->orderBy('created_at', 'ASC');
        } else {
            $query->orderBy('created_at', 'DESC');
        }

        $courses = $query->get();

        return response()->json([
            'status' => 200,
            'data' => $courses,
        ]);
    }

    // Single course detail with chapters, lessons, outcomes, requirements
    public function show($id)
    {
        $course = Course::where('id', $id)
            ->where('status', 1)
            ->withCount('enrollments')
            ->with('category', 'level', 'language')
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        // Get chapters (sections) from lessons table
        $chapters = lesson::where('course_id', $course->id)
            ->orderBy('sort_order', 'ASC')
            ->get();

        // Get lessons for each chapter from chapters table
        foreach ($chapters as $ch) {
            $ch->lessons = chapter::where('chapter_id', $ch->id)
                ->orderBy('sort_order', 'ASC')
                ->get();
        }

        // Get outcomes
        $outcomes = outcome::where('course_id', $course->id)->get();

        // Get requirements
        $requirements = requirement::where('course_id', $course->id)->get();

        // Get reviews with user info
        $reviews = \App\Models\Review::where('course_id', $course->id)
            ->with('user:id,name')
            ->orderBy('created_at', 'DESC')
            ->get();

        // Average rating
        $avgRating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;

        return response()->json([
            'status' => 200,
            'data' => $course,
            'chapters' => $chapters,
            'outcomes' => $outcomes,
            'requirements' => $requirements,
            'reviews' => $reviews,
            'avg_rating' => $avgRating,
        ]);
    }

    // Get filter options (categories, levels, languages)
    public function filters()
    {
        $categories = Category::all();
        $levels = level::all();
        $languages = language::all();

        return response()->json([
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
    }

    // Enroll in a course
    public function enroll(Request $request, $courseId)
    {
        $user = auth()->user();
        $course = Course::where('id', $courseId)->where('status', 1)->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        // Check if already enrolled
        $existing = enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 400,
                'message' => 'Already enrolled in this course',
            ], 400);
        }

        enrollment::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Enrolled successfully',
        ]);
    }

    // Check enrollment status
    public function checkEnrollment($courseId)
    {
        $user = auth()->user();
        $enrolled = enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        return response()->json([
            'status' => 200,
            'enrolled' => $enrolled,
        ]);
    }

    // Get enrolled courses for current user
    public function enrolledCourses()
    {
        $user = auth()->user();
        $enrollments = enrollment::where('user_id', $user->id)
            ->with('course.category', 'course.level')
            ->orderBy('created_at', 'DESC')
            ->get();

        $courses = $enrollments->map(function ($e) {
            return $e->course;
        })->filter();

        return response()->json([
            'status' => 200,
            'data' => $courses->values(),
        ]);
    }
}
