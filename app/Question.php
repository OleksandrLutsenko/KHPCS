<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Question extends Model
{
    use SoftDeletes;

    const TYPE_CHECKBOX = 0;
    const TYPE_RADIO = 1;
    const TYPE_TXT = 2;
    const TYPE_DATE = 3;

    const VALIDATION_TYPE_TEXT_AND_NUMBERS = 0;
    const VALIDATION_TYPE_TEXT = 1;
    const VALIDATION_TYPE_NUMBERS = 2;

    protected $fillable = ['title', 'type', 'order_number', 'child_order_number', 'parent_answer_id', 'identifier', 'validation_type', 'characters_limit'];

    protected $visible = ['id', 'title', 'answers', 'type', 'block_id', 'order_number', 'child_order_number', 'parent_answer_id', 'identifier', 'validation_type', 'characters_limit'];

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
            $question->deleteAnswers();
            $customerAnswers = $question->customerAnswer;
            foreach ($customerAnswers as $customerAnswer) {
                $customerAnswer->delete();
            }
            foreach ($answers as $answer) {
                $answer->delete();
            }

        });
    }

    //////
    public function deleteAnswers(){
        $answers = $this->answer;
        $customerAnswers = $this->customerAnswer;
        foreach ($customerAnswers as $customerAnswer) {
            $customerAnswer->delete();
        }
        foreach ($answers as $answer) {
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
            $answer->delete();
        }
    }

    public static function massSave(array $questionsData, Block $block){
        $questions = [];

        foreach ($questionsData as $questionData) {

            if($question = static::add($questionData, $block)){
                $questions[] = $question;
            }

        }

        return $questions;
    }

    public static function add($questionData, Block $block){
        //is id is set - work with existing record
        if(isset($questionData['id'])){

            //if question exists
            if($question = static::find($questionData['id'])){

                //if delete == true
                if(isset($questionData['delete']) && $questionData['delete'] == true){
                    //make delete
                    $question->delete();
                }else{
                    //update data
                    $question->update($questionData);
                }
            }

        }else{
            //if record is new
            /** @var Question $question */
            $question = $block->question()->create($questionData);

            if($question->hasRadioAnswer()){
                if (isset($questionData['answers'])) {
                    foreach ($questionData['answers'] as $answerData){
                        Answer::add($answerData, $question);
                    }
                }
            }
        }

        return $question ?? null;
    }
    ///////
}
