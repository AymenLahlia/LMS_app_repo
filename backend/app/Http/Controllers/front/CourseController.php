<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    //This method will return all the courses for a specific user
    public function index() {
        $courses = Course::all();
        return response()->json($courses);
    }
    
    //This method will store/save a course in the database as a draft
    public function store(Request $request){
        $validater = Validator::make($request->all(), [
            'title' => 'required|min:5',
        ]);
        if ($validater->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validater->errors(),
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
}

