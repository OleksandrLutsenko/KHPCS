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
use Illuminate\Support\Facades\DB;

class CustomerAnswerController extends Controller
{
    /**
     * @param CustomerAnswerRequest $request
     * @param Customer $customer
     * @param Question $question
     * @return array
     */
    public function store(CustomerAnswerRequest $request, Customer $customer, Question $question)
    {
        /** @var CustomerAnswer $customerAnswer */
        if (!$customerAnswer = $question->findCustomersAnswer($customer)) {
            $customerAnswer = $question->customerAnswer()->create($request->getAnswerAttributes($customer));

//            $block = $question->block;
//            $survey = $block->survey;
//            $customer->survey_status = $survey->id;
//            $customer->update();

        } else {
            $customerAnswer->update($request->getAnswerAttributes($customer));
        }

        $answer = Answer::find($customerAnswer->answer_id);

        return [
            'question identifier' => $question->identifier,
            'answer' => response()->json($customerAnswer, 201),
            'next_question' => $customerAnswer->answer_id ?
                Question::where('identifier', $answer->next_question)->get()->first()
                : ($question->next_question ?
                    Question::where('identifier', $question->next_question)->get()->first()
                    : 'This is the last question in this survey')
        ];
    }


    /**
     * @param CustomerAnswerRequest $request
     * @param Customer $customer
     * @param Question $question
     * @param Survey $survey
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function customerSurveyAnswers(CustomerAnswerRequest $request, Customer $customer, Question $question, Survey $survey)
    {
        $blockArray = Block::where('survey_id', '=', $survey->id)->get();
        $blockArrayIDs = array_column($blockArray->toArray(), 'id');

        $questionArray = Question::whereIn('block_id', $blockArrayIDs)->get();
        $questionArrayIDs = array_column($questionArray->toArray(), 'id');

        $customerAnswerArray = CustomerAnswer::whereIn('question_id', $questionArrayIDs)
                                             ->where('customer_id', '=', $customer->id)->get();

        return response([
            'status' => count($questionArray) == count($customerAnswerArray) ? 'completed' : 'in progress',
            'customerAnswers' => $customerAnswerArray
        ]);
    }
}