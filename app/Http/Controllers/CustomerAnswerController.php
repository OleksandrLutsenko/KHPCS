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
    public function store(CustomerAnswerRequest $request, Customer $customer, Question $question)
    {
        /** @var CustomerAnswer $customerAnswer */
        if (!$customerAnswer = $question->findCustomersAnswer($customer)) {
            $customerAnswer = $question->customerAnswer()->create($request->getAnswerAttributes($customer));
        } else {
            $customerAnswer->update($request->getAnswerAttributes($customer));
        }
//        $survey = $question->block->survey;
//        $blocks = $survey->block;
        $answer = Answer::find($customerAnswer->answer_id);

        return [
            'question identifier' => $question->identifier,
            'answer' => response()->json($customerAnswer, 201),
            'next_question' => $customerAnswer->answer_id ? Question::find($answer->next_question)
                : ($question->next_question ? Question::find($question->next_question)
                    : 'This is the last question in this survey'),
        ];
    }

//    public function show(CustomerAnswerRequest $request, CustomerAnswer $customerAnswer, Customer $customer, Question $question, Survey $survey)
//    {
//        $survey = $question->block->survey;
//        $blocks = $survey->block;
//        $customerAnswers = CustomerAnswer::all();
//        foreach ($blocks as $block){
//            foreach ($customerAnswers as $customerAnswerrr){
//                if($customerAnswerrr->question->id == $question->id){
//                    $CA[] = $customerAnswerrr;
//                }
//        }
//        return $CA;
//
//        }
//    }
}
