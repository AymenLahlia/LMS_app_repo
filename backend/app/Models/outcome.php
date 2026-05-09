<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class outcome extends Model
{
    protected $fillable = ['course_id', 'text', 'sort_order'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
