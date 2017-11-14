<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Survey extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'status'];

    protected $visible = ['id', 'name', 'status', 'survey_status', 'blocks'];

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

    public function contracts(){
        return $this->hasMany(Contract::class);
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
            0 => 'archived'
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
