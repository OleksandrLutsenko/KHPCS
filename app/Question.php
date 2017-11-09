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

    protected $fillable = ['title', 'type', 'identifier'];

    protected $visible = ['id', 'title', 'answers', 'type', 'identifier'];
//    protected $visible = ['id', 'title', 'answers', 'type', 'identifier', 'customer_answers'];

    protected $appends = ['answers'];
//    protected $appends = ['answers', 'customer_answers'];

    public function setVisibleAnswers(){
        $this->visible = ['title', 'answers'];
    }

    public function setVisibleCustomerAnswers(){
        $this->visible = ['title', 'customer_answers'];
    }

    public function makeVisible($attribute)
    {
        $this->visible = $attribute;
    }

    public function block(){
        return $this->belongsTo(Block::class);
    }

    public function answer(){
        return $this->hasMany(Answer::class);
    }

    public function answerRelate(){
        return $this->hasOne(Answer::class);
    }

    public function customerAnswer(){
        return $this->hasOne(CustomerAnswer::class);
    }

    public function getAnswersAttribute()
    {
        return $this->answer;
    }

    public function hasRadioAnswer(){
        return $this->type == static::TYPE_RADIO;
    }

    public function getCustomerAnswersAttribute()
    {
        return $this->customerAnswer;
    }

    public function findCustomersAnswer(Customer $customer){
        return $this->customerAnswer()->where('customer_id', $customer->id)->first();
    }
}
