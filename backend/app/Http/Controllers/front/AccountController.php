<?php

namespace App\Http\Controllers\front;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class AccountController extends Controller
{
    public function register(Request $request)
    {
        $request->merge([
            'email' => strtolower(trim($request->email)),
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email:rfc,dns|unique:users',
            'password' => ['required', \Illuminate\Validation\Rules\Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
            'terms_accepted' => 'accepted',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
                'message' => 'Please accept the terms and conditions and fix validation errors.'
            ],400);
        }


        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'student';
        $user->terms_accepted = true;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Registration successful',
        ],200);
    }
    


    public function authenticate(Request $request)
    {
        $request->merge([
            'email' => strtolower(trim($request->email)),
        ]);

        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_pic' => $user->profile_pic,
                'id' => Auth::user()->id
            ],200);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Either Email/Password is incorrect'
            ],401);
        }
    }

    // Update profile
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->merge([
            'email' => strtolower(trim($request->email)),
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:2',
            'email' => 'required|email:rfc,dns|unique:users,email,' . $user->id,
            'last_name' => 'nullable|string',
            'phone' => 'nullable|string',
            'language' => 'nullable|string',
            'nationality' => 'nullable|string',
            'gender' => 'nullable|string',
            'birthday' => 'nullable|date',
            'bio' => 'nullable|string',
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $user->name = $request->name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->language = $request->language;
        $user->nationality = $request->nationality;
        $user->gender = $request->gender;
        $user->birthday = $request->birthday;
        $user->bio = $request->bio;

        if ($request->hasFile('profile_pic')) {
            // Delete old pic if exists
            if ($user->profile_pic) {
                \Illuminate\Support\Facades\Storage::delete('public/' . $user->profile_pic);
            }
            $path = $request->file('profile_pic')->store('profile_pics', 'public');
            $user->profile_pic = $path;
        }

        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Profile updated successfully',
            'data' => $user,
        ]);
    }

    // Change password
    public function changePassword(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 400,
                'message' => 'Current password is incorrect',
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Password changed successfully',
        ]);
    }

    // Dashboard stats — branches by role
    public function dashboardStats()
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            $totalStudents = \App\Models\User::where('role', 'student')->count();
            $totalCourses = \App\Models\Course::count();
            $totalEnrollments = \App\Models\enrollment::count();

            // Courses created by this admin
            $myCourses = \App\Models\Course::where('user_id', $user->id)->get();
            $myEnrolled = \App\Models\enrollment::whereIn('course_id', $myCourses->pluck('id'))->count();

            return response()->json([
                'role' => 'admin',
                'total_students' => $totalStudents,
                'total_courses' => $totalCourses,
                'total_enrollments' => $totalEnrollments,
                'sales' => $myEnrolled,
                'enrolled' => $myEnrolled,
                'courses' => $myCourses->where('status', 1)->count(),
            ]);
        }

        // Student stats
        $enrolledCount = \App\Models\enrollment::where('user_id', $user->id)->count();
        $completedLessons = \Illuminate\Support\Facades\DB::table('progress')
            ->where('user_id', $user->id)
            ->where('is_completed', 'yes')
            ->count();

        return response()->json([
            'role' => 'student',
            'enrolled' => $enrolledCount,
            'completed_lessons' => $completedLessons,
        ]);
    }
}
