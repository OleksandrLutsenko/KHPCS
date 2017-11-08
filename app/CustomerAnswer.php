<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerAnswer extends Model
{
    use SoftDeletes;

    protected $fillable = ['value', 'answer_id', 'question_id', 'customer_id'];

//    protected $appends = ['value', 'answer_id', 'question_id', 'customer_id', 'answers'];

//    protected $visible = ['value', 'answer_id', 'question_id', 'customer_id', 'answers'];


    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function question(){
        return $this->hasOne(Question::class, 'id', 'question_id');
    }

    public function answer(){
        return $this->hasOne(Answer::class, 'id', 'answer_id');
    }

//    public function getAnswersAttribute()
//    {
//        return $this->answer();
//    }

}
