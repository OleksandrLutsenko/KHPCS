<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerAnswer extends Model
{
    use SoftDeletes;

    protected $fillable = ['value', 'answer_id', 'question_id', 'customer_id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function question(){
        return $this->hasOne(Question::class, 'id', 'question_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function answer(){
        return $this->hasOne(Answer::class, 'id', 'answer_id');
    }

//    public function getAnswersAttribute()
//    {
//        return $this->answer();
//    }
}
