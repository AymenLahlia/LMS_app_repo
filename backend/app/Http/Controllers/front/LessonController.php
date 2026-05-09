<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    // List all lessons for a chapter
    public function index($chapterId)
    {
        $lessons = chapter::where('chapter_id', $chapterId)
            ->orderBy('sort_order', 'ASC')
            ->orderBy('id', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $lessons,
        ]);
    }

    // Get a single lesson
    public function show($id)
    {
        $lesson = chapter::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson,
        ]);
    }

    // Add a new lesson
    public function store(Request $request, $chapterId)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3',
            'description' => 'nullable|string',
            'is_free_preview' => 'nullable|in:yes,no',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $maxSort = chapter::where('chapter_id', $chapterId)->max('sort_order');

        $lesson = chapter::create([
            'chapter_id'     => $chapterId,
            'title'          => $request->title,
            'description'    => $request->description,
            'is_free_preview' => $request->is_free_preview ?? 'no',
            'sort_order'     => ($maxSort ?? 0) + 1,
            'status'         => 1,
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Lesson added successfully',
            'data'    => $lesson,
        ]);
    }

    // Update a lesson
    public function update(Request $request, $id)
    {
        $lesson = chapter::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|min:3',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer',
            'is_free_preview' => 'nullable|in:yes,no',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        if ($request->has('title'))           $lesson->title = $request->title;
        if ($request->has('description'))     $lesson->description = $request->description;
        if ($request->has('duration'))        $lesson->duration = $request->duration;
        if ($request->has('is_free_preview')) $lesson->is_free_preview = $request->is_free_preview;

        $lesson->save();

        return response()->json([
            'status'  => 200,
            'message' => 'Lesson updated successfully',
            'data'    => $lesson,
        ]);
    }

    // Upload lesson video
    public function uploadVideo(Request $request, $id)
    {
        $lesson = chapter::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'video' => 'required|mimes:mp4,mov,avi,wmv,webm|max:102400',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Delete old video if exists
        if ($lesson->video && Storage::disk('public')->exists($lesson->video)) {
            Storage::disk('public')->delete($lesson->video);
        }

        // Store new video
        $path = $request->file('video')->store('lessons/videos', 'public');
        $lesson->video = $path;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Video uploaded successfully',
            'data' => $lesson,
            'video_url' => asset('storage/' . $path),
        ]);
    }

    // Delete a lesson
    public function destroy($id)
    {
        $lesson = chapter::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        // Delete video file if exists
        if ($lesson->video && Storage::disk('public')->exists($lesson->video)) {
            Storage::disk('public')->delete($lesson->video);
        }

        $lesson->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Lesson deleted successfully',
        ]);
    }

    // Reorder lessons
    public function sort(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:chapters,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        foreach ($request->ids as $index => $id) {
            chapter::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Lessons reordered successfully',
        ]);
    }
}
