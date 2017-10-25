<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['title'];

    public function block(){
        return $this->belongsTo(Block::class);
    }
}
