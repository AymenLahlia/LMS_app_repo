<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    // Student submits a review (only if enrolled, one per course)
    public function store(Request $request, $courseId)
    {
        $user = auth()->user();

        // Check enrolled
        $enrolled = DB::table('enrollments')
            ->where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        if (!$enrolled) {
            return response()->json(['status' => 403, 'message' => 'You must be enrolled to leave a review'], 403);
        }

        // Check if already reviewed
        $existing = Review::where('user_id', $user->id)->where('course_id', $courseId)->first();
        if ($existing) {
            return response()->json(['status' => 400, 'message' => 'You have already reviewed this course'], 400);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 1,
        ]);

        $review->load('user:id,name');

        return response()->json([
            'status' => 200,
            'message' => 'Review submitted successfully',
            'data' => $review,
        ]);
    }

    // Student edits their own review
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $review = Review::where('id', $id)->where('user_id', $user->id)->first();

        if (!$review) {
            return response()->json(['status' => 404, 'message' => 'Review not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $review->load('user:id,name');

        return response()->json([
            'status' => 200,
            'message' => 'Review updated',
            'data' => $review,
        ]);
    }
}
