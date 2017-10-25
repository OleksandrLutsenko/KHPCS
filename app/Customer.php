<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $visible = ['name', 'reports'];

    protected $appends = ['reports'];

    public function reports(){
        return $this->hasMany(Report::class);
    }

    public function getReportsAttribute()
    {
        return $this->question;
    }
}
