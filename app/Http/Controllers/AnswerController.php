<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Question;
use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnswerController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Answer $answer
     * @return array
     */
    public function show(Answer $answer)
    {
        return compact('answer');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Answer $answer
     * @param  \Illuminate\Http\Request $request
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Answer $answer, Request $request, User $user)
    {
        if ($user->can('update', $answer)) {
            if ($answer->question->hasRadioAnswer()){
                $answer->update($request->all());
            }
            return compact('answer');
        }else{
            abort(404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Survey $survey
     * @param Block $block
     * @param Question $question
     * @param Answer $answer
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Survey $survey, Block $block, Question $question, Answer $answer, User $user)
    {
        if ($user->can('delete', $answer)) {
            if ($answer->question->hasRadioAnswer()) {
                $answer->delete();
            }
            return compact('answer');
        }else{
            abort(404);
        }
    }
}
