<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Survey extends Model
{
    protected $fillable = ['name', 'description'];

    public function user(){
        return $this->belongsToMany(User::class);
    }

    public function block(){
        return $this->hasMany(Block::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });
    }


}
