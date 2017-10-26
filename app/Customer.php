<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{
    protected $fillable = ['name', 'surname', 'classification'];

//    protected $appends = ['reports'];

    public function report(){
        return $this->belongsToMany(Survey::class, 'customer_surveys');
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

//    public function getReportsAttribute()
//    {
//        return $this->report;
//    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });
    }
}
