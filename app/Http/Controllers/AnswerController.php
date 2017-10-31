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
//    /**
//     * Display a listing of the resource.
//     *
//     * @return \Illuminate\Http\Response
//     */
//    public function index(Survey $survey, Block $block, Question $question, Answer $answer)
//    {
//        $answer = $question->answer()->get();
//        return $answer;
//    }
//
//
//    /**
//     * Store a newly created resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @return \Illuminate\Http\Response
//     */
//    public function store(Request $request, Survey $survey, Block $block, Question $question, Answer $answer)
//    {
//        if(Auth::user()->role_id == 2) {
//            if ($question->type == 1) {
//                $answer = $question->answer()->create($request->all());
//                return response()->json($answer, 201);
//            }
//        }
//    }
//
//    /**
//     * Display the specified resource.
//     *
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function show(Survey $survey, Block $block,Question $question, Answer $answer)
//    {
//        return $answer;
//    }
//
//
//    /**
//     * Update the specified resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function update(Request $request, Survey $survey, Block $block, Question $question, Answer $answer)
//    {
//        if(Auth::user()->role_id == 2) {
//            if ($question->type == 1) {
//                $answer->update($request->all());
//                return response()->json($answer, 200);
//            }
//        }
//    }
//
//    /**
//     * Remove the specified resource from storage.
//     *
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function destroy(Survey $survey, Block $block, Question $question, Answer $answer)
//    {
//        if(Auth::user()->role_id == 2) {
//            if ($question->type == 1) {
//                $answer->delete();
//                return response()->json(null, 204);
//            }
//        }
//    }



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
