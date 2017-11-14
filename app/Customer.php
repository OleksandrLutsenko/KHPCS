<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'surname', 'classification'];

    protected $visible = ['id', 'name', 'surname', 'classification'];

//    protected $appends = ['reports'];

    public function report(){
        return $this->belongsToMany(Survey::class, 'customer_surveys');
    }

    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

    public function user(){
        return $this->belongsToMany(User::class);
    }

    public function getReportsAttribute()
    {
        return $this->report;
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });
    }

    public function scopeOwned($query){
        return $query->where('user_id', Auth::user()->id);
    }
}
