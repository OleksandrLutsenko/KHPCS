<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'surname', 'classification'];

    protected $visible = ['id', 'name', 'surname', 'classification', 'reports'];

    protected $appends = ['reports'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function report(){
        return $this->hasMany(Report::class);
    }

//    public function report(){
//        return $this->belongsToMany(Report::class, 'customer_survey');
//    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function user(){
        return $this->belongsToMany(User::class);
    }

    /**
     * @return mixed
     */
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

    /**
     * @param $query
     * @return mixed
     */
    public function scopeOwned($query){
        return $query->where('user_id', Auth::user()->id);
    }
}
