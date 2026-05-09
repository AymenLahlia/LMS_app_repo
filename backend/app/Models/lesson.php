<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class lesson extends Model
{
    protected $fillable = ['course_id', 'title', 'sort_order', 'status'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function chapters()
    {
        return $this->hasMany(chapter::class, 'chapter_id')->orderBy('sort_order', 'ASC');
    }
}
