<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseOutcomeController extends Controller
{
    // List all outcomes for a course
    public function index($courseId)
    {
        $outcomes = outcome::where('course_id', $courseId)
            ->orderBy('sort_order', 'ASC')
            ->orderBy('id', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $outcomes,
        ]);
    }

    // Add a new outcome
    public function store(Request $request, $courseId)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|min:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Determine the next sort_order
        $maxSort = outcome::where('course_id', $courseId)->max('sort_order');

        $outcome = outcome::create([
            'course_id'  => $courseId,
            'text'       => $request->text,
            'sort_order' => ($maxSort ?? 0) + 1,
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Outcome added successfully',
            'data'    => $outcome,
        ]);
    }

    // Update an existing outcome
    public function update(Request $request, $id)
    {
        $outcome = outcome::find($id);

        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'text' => 'required|string|min:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $outcome->text = $request->text;
        $outcome->save();

        return response()->json([
            'status'  => 200,
            'message' => 'Outcome updated successfully',
            'data'    => $outcome,
        ]);
    }

    // Delete an outcome
    public function destroy($id)
    {
        $outcome = outcome::find($id);

        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found',
            ], 404);
        }

        $outcome->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Outcome deleted successfully',
        ]);
    }

    // Reorder outcomes
    public function sort(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:outcomes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        foreach ($request->ids as $index => $id) {
            outcome::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Outcomes reordered successfully',
        ]);
    }
}
