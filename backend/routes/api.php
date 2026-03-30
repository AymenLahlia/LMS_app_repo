<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::group(["middleware" => ["auth:sanctum"]], function () {
    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/meta-data', [CourseController::class, 'metadata']);
    Route::get('/courses/{id}', [CourseController::class, 'show'])->whereNumber('id');
    Route::put('/courses/{id}', [CourseController::class, 'update'])->whereNumber('id');
});
