<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Survey extends Model
{
    protected $fillable = ['name', 'description', 'status'];

    protected $visible = ['id', 'name', 'survey_status', 'blocks', 'description'];

    protected $appends = ['survey_status', 'blocks'];

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

    public function getSurveyStatusAttribute()
    {
        return $this->getStatusLabel();
    }
//
    public function getStatusLabel(){
        $statusValueLabelMap = static::getStatusValueLabelMap();

//        return isset($statusValueLabelMap[$this->status]) ? $statusValueLabelMap[$this->status] : null;
        return $statusValueLabelMap[$this->status];
    }
//
    public static function getStatusValueLabelMap(){
        return [
            1 => 'active',
            2 => 'inactive',
        ];
    }

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
