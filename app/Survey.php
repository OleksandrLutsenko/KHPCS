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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function user(){
        return $this->belongsToMany(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function customers(){
        return $this->belongsToMany(Customer::class, 'customer_surveys');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function block(){
        return $this->hasMany(Block::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function contracts(){
        return $this->hasMany(Contract::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reports(){
        return $this->hasMany(Report::class);
    }

    /**
     * @return mixed
     */
    public function getBlocksAttribute()
    {
        $block = $this->block()
            ->whereNotNull('order_number')
            ->orderBy('order_number')->get();
        return $block;
    }

    /**
     * @return mixed
     */
    public function getSurveyStatusAttribute()
    {
        return $this->getStatusLabel();
    }

    /**
     * @return mixed
     */
    public function getStatusLabel(){
        $statusValueLabelMap = static::getStatusValueLabelMap();

//        return isset($statusValueLabelMap[$this->status]) ? $statusValueLabelMap[$this->status] : null;
        return $statusValueLabelMap[$this->status];
    }

    /**
     * @return array
     */
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
