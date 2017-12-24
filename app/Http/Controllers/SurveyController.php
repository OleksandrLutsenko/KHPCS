<?php

namespace App\Http\Controllers;

use App\Customer;
use App\CustomerAnswer;
use App\Http\Requests\BlockRequest;
use App\Http\Requests\SurveyRequest;
use App\Question;
use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SurveyController extends Controller
{
    /**
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Database\Eloquent\Collection|\Symfony\Component\HttpFoundation\Response|static[]
     */
    public function index(Survey $survey, User $user)
    {
        return Survey::all();
    }

    public function onlySurvey(Survey $survey, User $user)
    {
        $surveys = Survey::all();
        foreach ($surveys as $survey){
            $result[] = [
                'survey_name' => $survey->name,
                'survey_id' => $survey->id,
                'survey_status' => $survey->status
            ];
        }
        return compact('result');
    }

//    /**
//     * @param Survey $survey
//     * @param Customer $customer
//     * @param Request $request
//     * @param CustomerAnswer $customerAnswer
//     * @param User $user
//     * @return \Illuminate\Http\JsonResponse
//     */
//    public function answerAll(Survey $survey, Customer $customer, Request $request, CustomerAnswer $customerAnswer, User $user){
//        if ($user->can('answerAll', $survey)) {
//            $customer = $customer->create($request->customer);
//
//            foreach ($request->answers as $questionID => $answerID) {
//                $customerAnswer->create([
//                    'value' => null,
//                    'question_id' => $questionID,
//                    'answer_id' => $answerID,
//                    'customer_id' => $customer->id
//                ]);
//            }
//            return response()->json($customer, 200);
//        } else {
//            return response([
//                "error" => "You do not have a permission"], 404
//            );
//        }
//    }

    /**
     * Store a newly created resource in storage.
     *
     * @param SurveyRequest $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function store(SurveyRequest $request, Survey $survey, User $user)
    {
        if ($user->can('create', $survey)) {
            $survey = $survey->create($request->all());
            return compact('survey');
        } else {
            return response([
                "error" => "You do not have a permission"], 404

            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param BlockRequest $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function addBlock(BlockRequest $request, Survey $survey, User $user)
    {
        if ($user->can('addBlock', $survey)) {
            $block = $survey->block()->create($request->all());
            return compact('block');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show(Survey $survey, User $user)
    {
        return compact('survey');
    }

    public function surveyDeletedQuestions(Survey $survey, User $user)
    {
        $deletedQuestions = $survey->trashedQuestions($survey);
        return compact('deletedQuestions');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SurveyRequest $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(SurveyRequest $request, Survey $survey, User $user)
    {
        if ($user->can('update', $survey)) {
            $survey->update($request->all());
            return compact('survey');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
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
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * @param Request $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function changeStatusActiveInactive(Request $request, Survey $survey, User $user){
        if ($user->can('update', $survey)) {
            if ($survey->status == 2){
                $surveys = Survey::all();

                foreach ($surveys as $otherSurvey){
                    if($otherSurvey->status != 0) {
                        $otherSurvey->status = 2;
                        $otherSurvey->update();
                    }
                }
                $survey->status = 1;
                $survey->update();
            }

            return response(['survey' => $survey]);

        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * @param Request $request
     * @param Survey $survey
     * @param User $user
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function changeStatusArchive(Request $request, Survey $survey, User $user){
        if ($user->can('update', $survey)) {
            if ($survey->status == 2) {
                $survey->status = 0;
                $survey->update();
            }
            else if ($survey->status == 0){
                $survey->status = 2;
                $survey->update();
            }
            return response(['survey' => $survey]);
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }

    }

    /**
     * @param Survey $survey
     * @param Customer $customer
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function customerIndex(Survey $survey, Customer $customer)
    {
        return Survey::all();
    }

    /**
     * @param Survey $survey
     * @param Customer $customer
     * @return array
     */
    public function customerShow(Survey $survey, Customer $customer)
    {
        return compact('survey');
    }

}
