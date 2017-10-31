<?php

namespace App\Http\Controllers;

use App\Block;
use App\Customer;
use App\Question;
use App\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    /**
     * Show question's answers
     *
     * @param Question $question
     * @return array
     */
    public function show(Question $question)
    {
        $answers = $question->answers;
        return compact('answers', 'question');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Question $question
     * @param Request $request
     * @return array
     */
    public function addAnswer(Question $question, Request $request)
    {
        if($question->hasRadioAnswer()) {
            $answer = $question->answer()->create($request->all());

            return compact('answer');
            //TODO it is return true 200

        }
        else {
            return false;
        }
    }

    /**
     * Update question
     *
     * @param Request $request
     * @param Question $question
     * @return array
     */
    public function update(Question $question, Request $request)
    {
        $question->update($request->all());
        return compact('question');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Question $question
     * @return array
     */
    public function destroy(Question $question)
    {
        $question->delete();
        return compact('question');
    }


}

