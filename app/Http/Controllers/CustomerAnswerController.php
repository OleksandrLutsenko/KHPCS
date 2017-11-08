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
    public function store(CustomerAnswerRequest $request, Customer $customer, Question $question){
        /** @var CustomerAnswer $customerAnswer */
            if(!$customerAnswer = $question->findCustomersAnswer($customer)){
            $customerAnswer = $question->customerAnswer()->create($request->getAnswerAttributes($customer));
        }else{
            $customerAnswer->update($request->getAnswerAttributes($customer));
        }

        $answer = Answer::find($customerAnswer->answer_id);

        return [
                'question identifier' => $question->identifier,
                'answer' => response()->json($customerAnswer, 201),
                'next_question' => $customerAnswer->answer_id ? Question::find($answer->next_question) : null
            ];
    }
}
