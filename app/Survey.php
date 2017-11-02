<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Survey extends Model
{
    protected $fillable = ['name', 'description', 'status'];

    protected $visible = ['id', 'name', 'blocks', 'description'];

    protected $appends = ['blocks', 'status'];

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

    //TODO does not work!!!
//    public function getStatusAttribute()
//    {
//        return $this->getStatusLabel();
//    }
//
//    public function getStatusLabel(){
//        $statusValueLabelMap = static::getStatusValueLabelMap();
//
//        dd($this->status);
//
//        return isset($statusValueLabelMap[$this->status]) ? $statusValueLabelMap[$this->status] : null;
//    }
//
//    public static function getStatusValueLabelMap(){
//        return [
//            1 => 'active',
//            2 => 'inactive',
//        ];
//    }

//    public function getAnswerAttribute()
//    {
//        return $this->customers->customerAnswer;
//    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });
    }


}
