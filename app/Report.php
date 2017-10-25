<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'customer_surveys';

    protected $fillable = ['user_id', 'survey_id'];

    protected $visible = ['name', 'surveys'];

    protected $appends = ['surveys'];

    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function getSurveysAttribute()
    {
        return $this->question;
    }


}
