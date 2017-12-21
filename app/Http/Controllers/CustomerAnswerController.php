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
     * @return array
     * @internal param Question $question
     */
    public function store(CustomerAnswerRequest $request, Customer $customer)
    {
        $requests = $request->all();
        foreach ($requests as $request) {

            if (isset($request['id'])) {
                $customerAnswer = CustomerAnswer::find($request['id']);
                if (isset($request['delete']) && $request['delete'] == true) {
                    $customerAnswer->delete();
                } else {
                    $customerAnswer->update($request);
                }
            } else {
                $customerAnswer = $customer->customerAnswers()->create($request);
            }
        }

        return response($customerAnswer, 201);
    }

//        foreach ($requests as $request) {
//            if (!$customerAnswer = $question->findCustomersAnswer($customer)) {
//                $customerAnswer = $question->customerAnswer()->create($request->getAnswerAttributes($customer));
//            } else {
//                if (isset($request['delete']) && $request['delete'] == true) {
//                    $customerAnswer = $question->findCustomersAnswer($customer);
//                    $customerAnswer->delete();
//                } else {
//                    $customerAnswer->update($request->getAnswerAttributes($customer));
//                }
//            }
//        }
//        return [
//            'answer' => response()->json($customerAnswer, 201)
//        ];


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

    /**
     * @param CustomerAnswerRequest $request
     * @param Customer $customer
     * @param Question $question
     * @param Survey $survey
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function customerSurveyBlockAnswers(CustomerAnswerRequest $request, Customer $customer, Question $question, Survey $survey)
    {
        $blockArray = Block::where('survey_id', '=', $survey->id)->get();

        foreach ($blockArray as $block){
            $questionArray = Question::where('block_id', $block->id)->get();
            $questionArrayIDs = array_column($questionArray->toArray(), 'id');

            $customerAnswerArray = CustomerAnswer::whereIn('question_id', $questionArrayIDs)
                ->where('customer_id', '=', $customer->id)->get();

            $result[] = ['block_id' => $block->id, 'customerAnswers' => $customerAnswerArray];
        }

        return response([
            'status' => count($questionArray) == count($customerAnswerArray) ? 'completed' : 'in progress',
            'customerAnswers' => $result
        ]);
    }
}
