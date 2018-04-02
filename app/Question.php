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
    const TYPE_COUNTRY = 4;

    const VALIDATION_TYPE_TEXT_AND_NUMBERS = 0;
    const VALIDATION_TYPE_TEXT = 1;
    const VALIDATION_TYPE_NUMBERS = 2;

    protected $fillable = ['title', 'type', 'order_number', 'child_order_number', 'parent_answer_id', 'identifier',
        'validation_type', 'characters_limit', 'mandatory', 'next_question', 'exit_value', 'information', 'contract_text', 'risk_value'];

    protected $visible = ['id', 'title', 'answers', 'type', 'block_id', 'order_number', 'child_order_number',
        'parent_answer_id', 'identifier', 'validation_type', 'characters_limit', 'mandatory', 'next_question',
        'exit_value', 'information', 'contract_text', 'risk_value', 'inherited'];

    protected $appends = ['answers', 'inherited'];

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

    public function hasCountryAnswer()
    {
        return $this->type == static::TYPE_COUNTRY;
    }

    /**
     * @return mixed
     */
    public function getCustomerAnswersAttribute()
    {
        return $this->customerAnswer;
    }

    public function getInheritedAttribute()
    {
        return false;
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
//            $question->deleteAnswers();
            $customerAnswers = $question->customerAnswer;
            foreach ($customerAnswers as $customerAnswer) {
                $customerAnswer->delete();
            }
            foreach ($answers as $answer) {
                $answer->delete();
            }

        });
    }

    ////////////

    static function delOrUpdate($obj, $var)
    {
        if (isset($obj['delete']) && $obj['delete'] == true) {
            $var->delete();
        } else {
            $var->update($obj);
        }
    }

    static function saveChildQuestionAnswers($childQuestion, $childQuestionObj)
    {
        if ($childQuestion->type == 1 or $childQuestion->type == 0) {
            if (isset($childQuestionObj['answers'])) {
                foreach ($childQuestionObj['answers'] as $childQuestionAnswerObj) {
                    if (isset($childQuestionAnswerObj['id'])) {
                        $childQuestionAnswer = Answer::find($childQuestionAnswerObj['id']);
                        Question::delOrUpdate($childQuestionAnswerObj, $childQuestionAnswer);
                    } else {
                        $childQuestion->answer()->create($childQuestionAnswerObj);
                    }
                }
            }
        }
    }

    static function saveChildAnswer($answerObj, $answer, $block)
    {
        if (!empty($answerObj['child_questions'])){
            foreach ($answerObj['child_questions'] as $childQuestionObj){
                if (isset($childQuestionObj['id'])){
                    $childQuestion = Question::find($childQuestionObj['id']);
                    $childQuestion->parent_answer_id = $answer->id;
                    $childQuestion->save();
                } else {
                    $childQuestion = $block->question()->create($childQuestionObj);
                    $childQuestion->parent_answer_id = $answer->id;
                    $childQuestion->save();
                    Question::saveChildQuestionAnswers($childQuestion, $childQuestionObj);
                }
            }
        }
    }

    static function saveAndUpdateChildAnswer($answerObj, $answer, $block)
    {
        if (!empty($answerObj['child_questions'])){
            foreach ($answerObj['child_questions'] as $childQuestionObj){
                if (isset($childQuestionObj['id'])){
                    $childQuestion = Question::find($childQuestionObj['id']);
                    $childQuestion->update($childQuestionObj);
                    $childQuestion->parent_answer_id = $answer->id;
                    $childQuestion->save();
                } else {
                    $childQuestion = $block->question()->create($childQuestionObj);
                    $childQuestion->parent_answer_id = $answer->id;
                    $childQuestion->save();
                    Question::saveChildQuestionAnswers($childQuestion, $childQuestionObj);
                }
            }
        }
    }

    static function saveUpdateDelChildQuestions($childQuestion, $childQuestionObj)
    {
        if ($childQuestion->type == 1 or $childQuestion->type == 0) {
            if (isset($childQuestionObj['answers'])) {
                foreach ($childQuestionObj['answers'] as $childQuestionAnswerObj) {
                    if (isset($childQuestionAnswerObj['id'])) {
                        $childQuestionAnswer = Answer::find($childQuestionAnswerObj['id']);
                        if (isset($childQuestionAnswerObj['delete']) && $childQuestionAnswerObj['delete'] == true) {
                            $childQuestionAnswer->delete();
                        } else {
                            $childQuestionAnswer->update($childQuestionAnswerObj);
                        }
                    } else {
                        $childQuestion->answer()->create($childQuestionAnswerObj);
                    }
                }
            }
        }
    }

    static function childQuestion($answerObj, $answer, $block)
    {
        if (!empty($answerObj['child_questions'])) {
            foreach ($answerObj['child_questions'] as $childQuestionObj) {
                if (isset($childQuestionObj['id'])) {
                    $childQuestion = Question::find($childQuestionObj['id']);
                    if (isset($childQuestionObj['delete']) && $childQuestionObj['delete'] == true){
                        $childQuestion->delete();
                    } else {
                        $childQuestion->update($childQuestionObj);
                        $childQuestion->parent_answer_id = $answer->id;
                        $childQuestion->save();
                        Question::saveUpdateDelChildQuestions($childQuestion, $childQuestionObj);
                    }
                } else {
                    $childQuestion = $block->question()->create($childQuestionObj);
                    $childQuestion->parent_answer_id = $answer->id;
                    $childQuestion->save();
                    Question::saveUpdateDelChildQuestions($childQuestion, $childQuestionObj);
                }
            }
        }
    }

    static function saveAnswers($questionObj, $question, $block)
    {
        if ($question->type == 1 or $question->type == 0) {
            if (isset($questionObj['answers'])) {
                foreach ($questionObj['answers'] as $answerObj) {

                    if (isset($answerObj['id'])) {
                        $answer = Answer::find($answerObj['id']);
                        if (isset($answerObj['delete']) && $answerObj['delete'] == true) {
                            $answer->delete();
                        } else {
                            $answer->update($answerObj);

                            Question::childQuestion($answerObj, $answer, $block);
                        }
                    } else {
                        $answer = $question->answer()->create($answerObj);
                        Question::saveChildAnswer($answerObj, $answer, $block);
                    }
                }
            }
            return $answer;
        }
    }

    static function massSaveQuestions($questionObj, $block)
    {
        if (isset($questionObj['id'])) {
            $question = Question::find($questionObj['id']);
            if (isset($questionObj['delete']) && $questionObj['delete'] == true){
                $question->delete();
            } else {
                $question->update($questionObj);
                Question::saveAnswers($questionObj, $question, $block);
            }
        } else {
            $question = $block->question()->create($questionObj);
            if ($question->type == 1 or $question->type == 0) {
                if (isset($questionObj['answers'])) {
                    foreach ($questionObj['answers'] as $answerObj){
                        $answer = $question->answer()->create($answerObj);
                        Question::saveAndUpdateChildAnswer($answerObj, $answer, $block);
                    }
                }
            }
        }
        return $question;
    }
}

