<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['name'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

}
