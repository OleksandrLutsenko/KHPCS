<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Customer;
use App\CustomerAnswer;
use App\Http\Requests\CustomerAnswerRequest;
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
     * @param CustomerAnswerRequest $request
     * @param Customer $customer
     * @param Question $question
     * @return array
     */
    public function store(CustomerAnswerRequest $request, Customer $customer, Question $question){
        /** @var CustomerAnswer $customerAnswer */
        $customerAnswer = $question->customerAnswer()->create($request->getAnswerAttributes($customer));

        return [
            'question identifier' => $question->identifier,
            'answer' => $customerAnswer->answer,
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
