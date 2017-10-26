<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $fillable = ['name'];

    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function question(){
        return $this->hasMany(Question::class);
    }
}
