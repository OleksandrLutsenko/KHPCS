<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerAnswer extends Model
{
    protected $fillable = ['value', 'answer_id', 'customer_id', 'question_id'];

    protected $visible = ['value', 'customer_id', 'question_id', 'question'];
//
//    protected $appends = ['question'];

    public function customer(){
        return $this->belongsTo(Customer::class);
    }
    public function question(){
        return $this->belongsToMany(Question::class);
    }
    public function answer(){
        return $this->belongsToMany(Answer::class);
    }

//    public function getQuestionAttribute()
//    {
//        return $this->question;
//    }
}
