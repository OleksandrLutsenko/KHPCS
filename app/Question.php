<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Question extends Model
{

    protected $fillable = ['title', 'type'];

//    protected $visible = ['title', 'answers'];
//    protected $visible = ['title', 'customer_answers'];
    //TODO: review
    protected $visible = ['title', 'customer_answers', 'answers'];

//    protected $appends = ['answers'];
//    protected $appends = ['customer_answers'];
    protected $appends = ['answers', 'customer_answers'];


    public function setVisibleAnswers(){
        $this->visible = ['title', 'answers'];
    }

    public function setVisibleCustomerAnswers(){
        $this->visible = ['title', 'customer_answers'];
    }

    public function block(){
        return $this->belongsTo(Block::class);
    }

    public function answer(){
        return $this->hasMany(Answer::class);
    }

    public function customerAnswer(){
        return $this->hasOne(CustomerAnswer::class);
    }

    public function getAnswersAttribute()
    {
        return $this->answer;
    }

    public function getCustomerAnswersAttribute()
    {
        return $this->customerAnswer;
    }
}
