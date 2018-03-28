<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Risk extends Model
{
    protected $fillable = [
        'min_range',
        'max_range',
        'description',
    ];

    public function survey(){
        return $this->belongsToMany(Survey::class);
    }

    public function company(){
        return $this->belongsToMany(Company::class);
    }
}
