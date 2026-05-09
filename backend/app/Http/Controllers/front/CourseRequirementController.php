<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseRequirementController extends Controller
{
    // List all requirements for a course
    public function index($courseId)
    {
        $requirements = requirement::where('course_id', $courseId)
            ->orderBy('sort_order', 'ASC')
            ->orderBy('id', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $requirements,
        ]);
    }

    // Add a new requirement
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

        $maxSort = requirement::where('course_id', $courseId)->max('sort_order');

        $requirement = requirement::create([
            'course_id'  => $courseId,
            'text'       => $request->text,
            'sort_order' => ($maxSort ?? 0) + 1,
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Requirement added successfully',
            'data'    => $requirement,
        ]);
    }

    // Update an existing requirement
    public function update(Request $request, $id)
    {
        $requirement = requirement::find($id);

        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found',
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

        $requirement->text = $request->text;
        $requirement->save();

        return response()->json([
            'status'  => 200,
            'message' => 'Requirement updated successfully',
            'data'    => $requirement,
        ]);
    }

    // Delete a requirement
    public function destroy($id)
    {
        $requirement = requirement::find($id);

        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found',
            ], 404);
        }

        $requirement->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Requirement deleted successfully',
        ]);
    }

    // Reorder requirements
    public function sort(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:requirements,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        foreach ($request->ids as $index => $id) {
            requirement::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Requirements reordered successfully',
        ]);
    }
}
