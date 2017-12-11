<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Customer;
use App\CustomerAnswer;
use App\Http\Requests\ReportRequest;
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

    /**
     * @param User $user
     * @param Report $report
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function showCustomerAnswer(User $user, Report $report){

        $customerAnswers = CustomerAnswer::where('customer_id', $report->customer_id)->get();
        foreach ($customerAnswers as $customerAnswer){
            $question = Question::find($customerAnswer->question_id);

            if($question->block->survey_id == $report->survey_id){
                $finalAnswer = CustomerAnswer::where('question_id', $question->id)->get()->first();

                $results[] = ['Question' => $question->title,
                              'CustomerAnswer' => $finalAnswer->value];
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
     * @param ReportRequest $request
     * @param User $user
     * @return \Illuminate\Http\Response
     */


    public function store(Report $report, ReportRequest $request, User $user)
    {
        $report = Report::create($request->all());
        return response()->json($report, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ReportRequest $request
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */

    public function update(ReportRequest $request, Report $report, User $user)
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
