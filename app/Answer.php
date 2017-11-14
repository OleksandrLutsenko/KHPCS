<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use SoftDeletes;

    protected $fillable = ['answer_text', 'next_question'];

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
