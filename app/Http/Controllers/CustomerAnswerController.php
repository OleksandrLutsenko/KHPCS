<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Customer;
use App\CustomerAnswer;
use App\Question;
use App\Survey;
use App\User;
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
     * @param  \Illuminate\Http\Request $request
     * @param Customer $customer
     * @param Survey $survey
     * @param Block $block
     * @param Question $question
     * @param Answer $answer
     * @param CustomerAnswer $customerAnswer
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Customer $customer, Survey $survey, Block $block, Question $question, Answer $answer, CustomerAnswer $customerAnswer, User $user)
    {

            $customerAnswer = new CustomerAnswer($request->all());

            $customerAnswer->customer_id = $customer->id;
            $customerAnswer->question_id = $question->id;

            if ($customerAnswer->value === null) {
                $answer = Answer::find($customerAnswer->answer_id);
                $customerAnswer->value = $answer->name;
            }
            $customerAnswer->save();

            return [
                'question identifier' => $question->identifier,
                'answer' => response()->json($customerAnswer, 201),
                'next_question identifier' => Question::find($answer->next_question)->identifier,
                'next_question' => Question::find($answer->next_question)
            ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Customer $customer
     * @param Survey $survey
     * @param Block $block
     * @param Question $question
     * @param Answer $answer
     * @param CustomerAnswer $customerAnswer
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, Customer $customer, Survey $survey, Block $block, Question $question, Answer $answer, CustomerAnswer $customerAnswer, User $user)
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
