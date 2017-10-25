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

    public function getReportsAttribute()
    {
        return $this->report;
    }
}
