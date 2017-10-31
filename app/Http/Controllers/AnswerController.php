<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Question;
use App\Survey;
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
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Answer $answer, Request $request)
    {
        if ($answer->question->hasRadioAnswer()){
            $answer->update($request->all());
        }
        return compact('answer');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Block $block, Question $question, Answer $answer)
    {
        if ($answer->question->hasRadioAnswer()) {
            $answer->delete();
        }
        return compact('answer');
    }
}
