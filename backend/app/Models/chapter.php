<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class chapter extends Model
{
    protected $fillable = ['chapter_id', 'title', 'is_free_preview', 'duration', 'video', 'description', 'sort_order', 'status'];

    // The parent chapter/section (stored in lessons table)
    public function lesson()
    {
        return $this->belongsTo(lesson::class, 'chapter_id');
    }
}
