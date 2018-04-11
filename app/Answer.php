<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use SoftDeletes;

    public static $questions = array();
    public static $answer_additional_text = array();

    protected $fillable = ['answer_text', 'question_id', 'order_number', 'next_question',
        'exit_value', 'information', 'contract_text', 'exit_information'];

    protected $appends = ['child_questions'];

    protected $casts = [
        'answer_text' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function question(){
        return $this->belongsTo(Question::class);
    }

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

    public static function additionalText($report)
    {
        $blocks = $report->survey->block;

        foreach ($blocks as $block) {
            foreach ($block->question as $question) {
                array_push(self::$questions, $question->id);
            }
        }

        $customer_answers = CustomerAnswer::where([
            'customer_id' => $report->customer_id
        ])
            ->whereIn('question_id', self::$questions)->get();

        foreach ($customer_answers as $customer_answer) {
            self::$answer_additional_text[$customer_answer->question()->first()->id] = $customer_answer->answer->contract_text;
        }

        return self::$answer_additional_text;
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
