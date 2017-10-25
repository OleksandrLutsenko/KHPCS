<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Question extends Model
{
    protected $fillable = ['title', 'type'];

    public function block(){
        return $this->belongsTo(Block::class);
    }

    public function answer(){
        return $this->hasMany(Answer::class);
    }
}
