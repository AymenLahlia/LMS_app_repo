<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    // Return all courses for the authenticated user
    public function index() {
        $courses = Course::where('user_id', request()->user()->id)->get();
        return response()->json($courses);
    }

    // Return course dropdown data
    public function dropdowns() {
        $categories = \App\Models\Category::orderBy('name', 'ASC')->where('status', 1)->get();
        $levels = \App\Models\level::orderBy('name', 'ASC')->where('status', 1)->get();
        $languages = \App\Models\language::orderBy('name', 'ASC')->where('status', 1)->get();

        return response()->json([
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
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

    // Update course cover image
    public function updateImage(Request $request, $id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Delete old image if exists
        if ($course->image && Storage::disk('public')->exists($course->image)) {
            Storage::disk('public')->delete($course->image);
        }

        // Store new image
        $path = $request->file('image')->store('courses', 'public');
        $course->image = $path;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course image updated successfully',
            'data' => $course,
            'image_url' => asset('storage/' . $path),
        ]);
    }

    // Toggle publish/unpublish
    public function togglePublish($id)
    {
        $course = Course::where('id', $id)
            ->where('user_id', auth()->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $course->status = $course->status == 1 ? 0 : 1;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => $course->status == 1 ? 'Course published' : 'Course unpublished',
            'data' => $course,
        ]);
    }

    // Delete a course
    public function destroy($id)
    {
        $course = Course::where('id', $id)
            ->where('user_id', auth()->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        // Delete cover image if exists
        if ($course->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($course->image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($course->image);
        }

        $course->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Course deleted successfully',
        ]);
    }
}