<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Validator;
use App\Models\Category;
use App\Models\Level;
use App\Models\Language;
class CourseController extends Controller
{
    // Return all courses for the authenticated user
    public function index() {
        $courses = Course::where('user_id', request()->user()->id)->get();
        return response()->json($courses);
    }

    // Store a new course as a draft
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $course = new Course();
        $course->title = $request->title;
        $course->status = '0';
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course created successfully',
            'data' => $course,
        ], 200);
    }

    // Return a single course by ID
    public function show($id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    // Update an existing course
    public function update(Request $request, $id) {
    $course = Course::find($id);

    if (!$course) {
        return response()->json([
            'status' => 404,
            'message' => 'Course not found',
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'title'       => 'sometimes|required|min:5',
        'category_id' => 'sometimes|nullable|integer|exists:categories,id',
        'level_id'    => 'sometimes|nullable|integer|exists:levels,id',
        'language_id' => 'sometimes|nullable|integer|exists:languages,id',
        'description' => 'sometimes|nullable|string',
        'price'       => 'sometimes|nullable|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors(),
        ], 400);
    }

    if ($request->has('title'))       $course->title       = $request->title;
    if ($request->has('category_id')) $course->category_id = $request->category_id;
    if ($request->has('level_id'))    $course->level_id    = $request->level_id;
    if ($request->has('language_id')) $course->language_id = $request->language_id;
    if ($request->has('description')) $course->description = $request->description;
    if ($request->has('price'))       $course->price       = (float) $request->price;

    $course->save();

    return response()->json([
        'status' => 200,
        'message' => 'Course updated successfully',
        'data' => $course,
    ], 200);
}

// this method will return the metadata for courses (categories, levels, languages)
    public function metadata(){
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'data' => [
                'categories' => $categories,
                'levels' => $levels,
                'languages' => $languages,
            ],
        ], 200);
    }
} 