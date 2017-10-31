<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Survey extends Model
{
    protected $fillable = ['name', 'description'];

    protected $visible = ['id', 'name', 'blocks', 'description'];

    protected $appends = ['blocks'];

    public function user(){
        return $this->belongsToMany(User::class);
    }

    public function customers(){
        return $this->belongsToMany(Customer::class, 'customer_surveys');
    }

    public function block(){
        return $this->hasMany(Block::class);
    }

    public function reports(){
        return $this->hasMany(Report::class);
    }

    public function getBlocksAttribute()
    {
        return $this->block;
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });
    }


}
