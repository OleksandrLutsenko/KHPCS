<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $visible = ['name', 'reports'];

    protected $appends = ['reports'];

    public function report(){
        return $this->belongsToMany(Survey::class, 'customer_surveys');
    }

    public function userAnswers(){
        return $this->hasMany(User_answer::class);
    }

    public function getReportsAttribute()
    {
        return $this->report;
    }
}
