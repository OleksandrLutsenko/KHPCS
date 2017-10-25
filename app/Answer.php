<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['name', 'type'];

    public function question(){
        return $this->belongsTo(Question::class);
    }
}
