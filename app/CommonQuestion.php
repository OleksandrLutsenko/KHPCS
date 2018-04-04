<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommonQuestion extends Model
{
    protected $fillable = ['title', 'type', 'validation_type', 'characters_limit', 'mandatory'];

    protected static function boot() {
        parent::boot();
        static::deleting(function($common_question) {
//            dd($common_question->id);
            $questions = Question::where('common_question_id', $common_question->id)->get();
//            dd($questions);
            foreach ($questions as $question) {
                $question->common_question_id = null;
                $question->save();

//                dd($question);
            }
        });
    }
}
