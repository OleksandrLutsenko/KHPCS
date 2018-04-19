<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommonQuestion extends Model
{
    protected $fillable = ['title', 'type', 'validation_type', 'characters_limit', 'mandatory'];

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
            $questions = Question::where('common_question_id', $common_question->id)->get();
            foreach ($questions as $question) {
                $question->common_question_id = null;
                $question->save();
            }
        });
    }
}
