<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes;

    protected $table = 'customer_surveys';

    protected $fillable = ['customer_id', 'survey_id'];

    protected $visible = ['id', 'customer_id', 'survey_id'];

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