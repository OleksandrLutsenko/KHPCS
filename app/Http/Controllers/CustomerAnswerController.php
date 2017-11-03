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
        if(!$customerAnswer = $question->findCustomersAnswer($customer)){
            $customerAnswer = $question->customerAnswer()->create($request->getAnswerAttributes($customer));
        }else{
            $customerAnswer->update($request->getAnswerAttributes($customer));
        }

        return [
            'question identifier' => $question->identifier,
            'answer' => $customerAnswer->answer,
        ];
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
