<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use SoftDeletes;

    protected $fillable = ['answer_text', 'question_id', 'order_number'];

    protected $appends = ['child_questions'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function question(){
        return $this->belongsTo(Question::class);
    }

//    /**
//     * @return \Illuminate\Database\Eloquent\Relations\HasMany
//     */
//    public function nextQuestions(){
//        return $this->hasMany(Question::class, 'next_question');
//    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }


    public function getChildQuestionsAttribute()
    {
        $childQuestions = Question::where('parent_answer_id', $this->id)
            ->whereNotNull('child_order_number')
            ->orderBy('child_order_number')->get();
        if($childQuestions){
            return $childQuestions;
        }
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($answer) {

            $childQuestions = Question::where('parent_answer_id', $answer->id)->get();
            foreach($childQuestions as $childQuestion){
                $customerAnswers = $childQuestion->customerAnswer;
                $childQuestionAnswers = $childQuestion->answer;
                foreach ($customerAnswers as $customerAnswer) {
                    $customerAnswer->delete();
                }
                foreach ($childQuestionAnswers as $childQuestionAnswer) {
                    $childQuestionAnswer->delete();
                }
                $childQuestion->delete();
            }
        });
    }
}
