<?php

namespace App\Http\Controllers;

use App\Customer;
use App\CustomerAnswer;
use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SurveyController extends Controller
{
    public function index(Survey $survey)
    {
            return Survey::all();
    }

    /**
     * @param Survey $survey
     * @param Customer $customer
     * @param Request $request
     * @param CustomerAnswer $customerAnswer
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function answerAll(Survey $survey, Customer $customer, Request $request, CustomerAnswer $customerAnswer, User $user){
        /** @var Customer $customer */

        if ($user->can('answerAll', $survey)) {
            $customer = $customer->create($request->customer);

            foreach ($request->answers as $questionID => $answerID){
                $customerAnswer->create([
                    'value' => null,
                    'question_id' => $questionID,
                    'answer_id' => $answerID,
                    'customer_id' => $customer->id
                ]);
            }

            return response()->json($customer, 200);
        }else{
            abort(404);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Survey $survey, User $user)
    {
        if ($user->can('create', $survey)) {
            $survey = $survey->create($request->all());
            return compact('survey');
        }else{
            abort(404);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param Survey $survey
     * @return \Illuminate\Http\JsonResponse
     */
    public function addBlock(Request $request, Survey $survey)
    {
        $block = $survey->block()->create($request->all());
        return compact('block');
    }

    /**
     * Display the specified resource.
     *
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show(Survey $survey)
    {
        return compact('survey');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, Survey $survey, User $user)
    {
        if ($user->can('update', $survey)) {
            $survey->update($request->all());
            return compact('survey');
        }else{
            abort(404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Survey $survey, User $user)
    {
        if ($user->can('delete', $survey)) {
            $survey->delete();
            return compact('survey');
        }else{
            abort(404);
        }

    }

}
