<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User_answer extends Model
{
    public function customer(){
        return $this->belongsToMany(Customer::class);
    }
    public function question(){
        return $this->belongsToMany(Question::class);
    }
    public function answer(){
        return $this->belongsToMany(Answer::class);
    }
}
