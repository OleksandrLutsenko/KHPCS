<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Question extends Model
{
    protected $fillable = ['title', 'type'];

    protected $visible = ['title', 'answers'];

    protected $appends = ['answers'];

    public function block(){
        return $this->belongsTo(Block::class);
    }

    public function answer(){
        return $this->hasMany(Answer::class);
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

    public function getAnswersAttribute()
    {
        return $this->answer;
    }
}
