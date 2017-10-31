<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Question extends Model
{
    const TYPE_RADIO = 1;
    const TYPE_TXT = 2;

    protected $fillable = ['title', 'type', 'identifier'];

    protected $visible = ['id', 'title', 'answers', 'type', 'identifier'];

    protected $appends = ['answers'];

    public function block(){
        return $this->belongsTo(Block::class);
    }

    public function answer(){
        return $this->hasMany(Answer::class);
    }

    public function answerRelate(){
        return $this->hasOne(Answer::class);
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

    public function getAnswersAttribute()
    {
        return $this->answer;
    }

    public function hasRadioAnswer(){
        return $this->type == static::TYPE_RADIO;
    }
}
