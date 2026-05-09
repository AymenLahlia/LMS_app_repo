<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    // List all chapters for a course
    public function index($courseId)
    {
        $chapters = lesson::where('course_id', $courseId)
            ->orderBy('sort_order', 'ASC')
            ->orderBy('id', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $chapters,
        ]);
    }

    // Add a new chapter
    public function store(Request $request, $courseId)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $maxSort = lesson::where('course_id', $courseId)->max('sort_order');

        $chapter = lesson::create([
            'course_id'  => $courseId,
            'title'      => $request->title,
            'sort_order' => ($maxSort ?? 0) + 1,
            'status'     => 1,
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Chapter added successfully',
            'data'    => $chapter,
        ]);
    }

    // Update an existing chapter
    public function update(Request $request, $id)
    {
        $chapter = lesson::find($id);

        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $chapter->title = $request->title;
        $chapter->save();

        return response()->json([
            'status'  => 200,
            'message' => 'Chapter updated successfully',
            'data'    => $chapter,
        ]);
    }

    // Delete a chapter
    public function destroy($id)
    {
        $chapter = lesson::find($id);

        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found',
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Chapter deleted successfully',
        ]);
    }

    // Reorder chapters
    public function sort(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:lessons,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        foreach ($request->ids as $index => $id) {
            lesson::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Chapters reordered successfully',
        ]);
    }
}
