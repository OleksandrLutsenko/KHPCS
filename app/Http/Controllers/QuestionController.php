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
//    /**
//     * Display a listing of the resource.
//     *
//     * @return \Illuminate\Http\Response
//     */
//    public function index(Survey $survey, Block $block, Question $question)
//    {
//        $question = $block->question()->get();
//        return $question;
//    }
//
//
//    /**
//     * Store a newly created resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @return \Illuminate\Http\Response
//     */
//    public function store(Request $request, Survey $survey, Block $block, Question $question)
//    {
//        if(Auth::user()->role_id == 2) {
//            $question = $block->question()->create($request->all());
//            return response()->json($question, 201);
//        }
//    }
//
//    /**
//     * Display the specified resource.
//     *
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function show(Survey $survey, Block $block, Question $question)
//    {
//        return $question;
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
//    public function update(Request $request, Survey $survey, Block $block, Question $question)
//    {
//        if(Auth::user()->role_id == 2) {
//            $question->update($request->all());
//            return response()->json($question, 200);
//        }
//    }
//
//    /**
//     * Remove the specified resource from storage.
//     *
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function destroy(Survey $survey, Block $block, Question $question)
//    {
//        if(Auth::user()->role_id == 2) {
//            $question->delete();
//            return response()->json(null, 204);
//        }
//    }
//
//    public function customerIndex(Customer $customer, Survey $survey, Block $block, Question $question)
//    {
//        $question = $block->question()->get();
//        return $question;
//    }
//
//    public function customerShow(Customer $customer, Survey $survey, Block $block, Question $question)
//    {
//        return $question;
//    }

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

