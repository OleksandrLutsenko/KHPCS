<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Question extends Model
{
    use SoftDeletes;

    const TYPE_RADIO = 1;
    const TYPE_TXT = 2;

    protected $fillable = ['title', 'type', 'order_number', 'child_order_number', 'parent_answer_id'];

    protected $visible = ['id', 'title', 'answers', 'type', 'block_id', 'order_number', 'child_order_number', 'parent_answer_id'];

    protected $appends = ['answers'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function answer()
    {
        return $this->hasMany(Answer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function answerRelate()
    {
        return $this->belongsTo(Answer::class, 'next_question');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function customerAnswer()
    {
        return $this->hasMany(CustomerAnswer::class);
    }

    /**
     * @return mixed
     */
    public function getAnswersAttribute()
    {
        $answes = $this->answer()
        ->whereNotNull('order_number')
        ->orderBy('order_number')->get();
        return $answes;
    }

    /**
     * @return bool
     */
    public function hasRadioAnswer()
    {
        return $this->type == static::TYPE_RADIO;
    }

    /**
     * @return mixed
     */
    public function getCustomerAnswersAttribute()
    {
        return $this->customerAnswer;
    }

    /**
     * @param Customer $customer
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function findCustomersAnswer(Customer $customer)
    {
        return $this->customerAnswer()->where('customer_id', $customer->id)->first();
    }

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($question) {
            if ($question->type == static::TYPE_TXT){
                $answers = $question->answer;
                foreach ($answers as $answer){
                    $answer->delete();
                }
            }
        });

        static::deleting(function ($question) {
            $answers = $question->answer;
            $customerAnswers = $question->customerAnswer;
            foreach ($customerAnswers as $customerAnswer) {
                $customerAnswer->delete();
            }
            foreach ($answers as $answer) {
                $answer->delete();
            }
        });
    }
}
