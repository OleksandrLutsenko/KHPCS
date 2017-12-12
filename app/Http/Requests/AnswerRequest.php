<?php

namespace App\Http\Requests;

use App\Question;
use Illuminate\Foundation\Http\FormRequest;

class AnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'answer_text' => 'required|min:1|max:50',
        ];
    }

    /**
     * @param $answer
     */

//    public function makeExtraQuestion($answer){
//        $question = Question::where('identifier', $answer->next_question)->get()->first();
//        if($answer->hasExtra == 1){
//            $question->extra = 1;
//            $question->update();
//        } else {
//            $question->extra = 0;
//            $question->update();
//        }
//    }

    public function noIdentifier($answer)
    {
        if($answer->hasHidden == false){
            $question = $answer->question;
            $question->identifier = null;
            $question->update();
        }
    }
}
