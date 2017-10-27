<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Customer;
use App\CustomerAnswer;
use App\Question;
use App\Survey;
use Illuminate\Http\Request;

class CustomerAnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Customer $customer, Survey $survey, Block $block, Question $question, Answer $answer, CustomerAnswer $customerAnswer)
    {
        $customerAnswer = new CustomerAnswer(
            $request->all()
        );

        $customerAnswer->customer_id = $customer->id;
        $customerAnswer->question_id = $question->id;

        if($customerAnswer->value === null){
            $answer = Answer::find($customerAnswer->answer_id);
            $customerAnswer->value = $answer->name;
        }
        $customerAnswer->save();

        return response()->json($customerAnswer, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Customer $customer, Survey $survey, Block $block, Question $question, CustomerAnswer $customerAnswer)
    {
        return $customerAnswer;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
