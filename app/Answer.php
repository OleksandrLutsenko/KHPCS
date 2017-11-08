<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['name', 'next_question'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function nextQuestion(){
        return $this->hasOne(Question::class, 'id', 'next_question');
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

}