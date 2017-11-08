<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Customer;
use App\CustomerAnswer;
use App\Report;
use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Question;
class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Report $report
     * @param User $user
     * @param Customer|Survey $customer
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     * @internal param User $user
     * @internal param Report $Report
     */
    public function index(Report $report, User $user, Customer $customer, Survey $survey, Question $question)
    {
        $reports = $report->all();
        return response()->json($reports, 201);
    }

    public function showCustomerAnswer(User $user, Report $report){

        $customerAnswers = CustomerAnswer::where('customer_id', $report->customer_id)->get();
        foreach ($customerAnswers as $customerAnswer){
            $question = Question::find($customerAnswer->question_id);

            if($question->block->survey_id == $report->survey_id){
                $finalAnswer = CustomerAnswer::where('question_id', $question->id)->get();

                $results[] = ['Question' => $question->title,
                              'CustomerAnswer' => $finalAnswer[0]->value];
            }
        }

        return response([
            'report' => $report->id,
            'customer' => $report->customer->name,
            'survey' => $report->survey->name,
            'results' => $results
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Report $report
     * @param  \Illuminate\Http\Request $request
     * @param User $user
     * @return \Illuminate\Http\Response
     */


    public function store(Report $report, Request $request, User $user)
    {
        $report = Report::create($request->all());
        return response()->json($report, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */

    public function update(Request $request, Report $report, User $user)
    {
        $report->update($request->all());
        return response()->json($report, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Report $report, User $user)
    {
            $report->delete();
            return response()->json(null, 204);
    }
}
