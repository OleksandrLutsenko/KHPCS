<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommonQuestion extends Model
{
    protected $fillable = ['title', 'type', 'order_number', 'child_order_number', 'parent_answer_id', 'identifier',
        'validation_type', 'characters_limit', 'mandatory', 'next_question', 'exit_value', 'information', 'contract_text', 'risk_value'];

    public function commonQuestionValues()
    {
        return $this->hasMany(CommonQuestionValue::class);
    }

    public function question()
    {
        return $this->hasMany(Question::class);
    }

    protected static function boot() {
        parent::boot();
        static::deleting(function($common_question) {
            $common_question->commonQuestionValues()->delete();
            $questions = Question::where('common_question_id', $common_question->id)->withTrashed()->get();
            foreach ($questions as $question) {
                $question->common_question_id = null;
                $question->save();
            }
        });
    }
}
