<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    protected $visible = ['id', 'name', 'questions'];

    protected $appends = ['questions'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function question()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * @return mixed
     */
    public function getQuestionsAttribute(){
        $question = $this->question()
            ->whereNotNull('order_number')
            ->orderBy('order_number')->get();
        return $question;
    }

//    protected static function boot()
//    {
//        parent::boot();
//
//        static::deleting(function ($question) {
//
//
//            $questions = $block->question;
//            foreach ($questions as $question){
//                $question->delete();
//
//            $answers = $question->answer;
//            $customerAnswers = $question->customerAnswer;
//            foreach ($customerAnswers as $customerAnswer) {
//                $customerAnswer->delete();
//            }
//
//            foreach ($answers as $answer) {
//                $answer->delete();
//            }
//
//        });
//        }
//    }
}
