<?php

namespace App\Http\Controllers;

use App\Contract;
use App\CustomerAnswer;
use App\Report;
use App\User;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Contract $contract, User $user)
    {
            return Contract::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Contract $contract, Report $report)
    {
//        $customerAnswers = CustomerAnswer::where('customer_id', $report->customer_id)->get();
//        foreach ($customerAnswers as $customerAnswer){
//            $question = Question::find($customerAnswer->question_id);
//
//            if($question->block->survey_id == $report->survey_id) {
//                $finalAnswer = CustomerAnswer::where('question_id', $question->id)->get();
//
//                $results[] = $finalAnswer[0];
//            }
//        }
//        return compact('customerAnswer', 'report');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function saveImage(Request $request)
    {
        //
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
