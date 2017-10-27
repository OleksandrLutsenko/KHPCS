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

//        return response()->json($customerAnswer->next_q, 201);
        return response()->json($customerAnswer, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(CustomerAnswer $customerAnswer)
    {
        return $customerAnswer;
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Customer $customer, Survey $survey, Block $block, Question $question, Answer $answer, CustomerAnswer $customerAnswer)
    {
//        $customerAnswer->customer_id = $customer->id;
//        $customerAnswer->question_id = $question->id;

        //TODO:review - it does not want to update the CustomerAnswer.
        if(!empty($customerAnswer->answer_id)){
        $answer = Answer::find($customerAnswer->answer_id);
        $customerAnswer->value = $answer->name;
        }

        $customerAnswer->update($request->all());
        return response()->json($customerAnswer, 200);
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
