<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{
    protected $fillable = ['name', 'surname', 'classification'];

//    protected $visible = ['name', 'customer_answer'];
    protected $visible = ['name', 'reports'];

//    protected $appends = ['customer_answer'];
    protected $appends = ['reports'];

    public function report(){
        return $this->belongsToMany(Survey::class, 'customer_surveys');
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

    public function getReportsAttribute()
    {
        return $this->report;
    }

//    public function getCustomerAnswerAttribute()
//    {
//        return $this->customerAnswers;
//    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });
    }
}
