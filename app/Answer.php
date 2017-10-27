<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['name'];

//    protected $visible = ['name', 'customer_answers'];

//    protected $appends = ['customer_answers'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

//    public function getCustomerAnswersAttribute()
//    {
//        return $this->question;
//    }
}
