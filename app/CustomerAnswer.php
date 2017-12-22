<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerAnswer extends Model
{
    use SoftDeletes;

    protected $fillable = ['value', 'answer_id', 'question_id', 'customer_id'];

    protected $appends = ['question'];

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

    public function getQuestionAttribute()
    {
        $question = Question::find($this->question_id)->title;
        return $question;
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($customerAnswer) {
            $customerAnswer->update([
                $customerAnswer->value = '<span style="background-color: red">N/A</span>'
            ]);
        });
    }
}
