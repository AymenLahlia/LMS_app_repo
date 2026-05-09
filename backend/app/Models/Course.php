<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function level()
    {
        return $this->belongsTo(level::class);
    }

    public function language()
    {
        return $this->belongsTo(language::class);
    }

    public function enrollments()
    {
        return $this->hasMany(enrollment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
