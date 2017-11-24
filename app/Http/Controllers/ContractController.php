<?php

namespace App\Http\Controllers;

use App\Contract;
use App\Customer;
use App\CustomerAnswer;
use App\Http\Requests\ContractRequest;
use App\Image;
use App\Question;
use App\Report;
use App\User;
use PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Contract $contract
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function index(Contract $contract, User $user)
    {
            return Contract::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ContractRequest|Request $request
     * @param Contract $contract
     * @return \Illuminate\Http\Response
     */
    public function store(ContractRequest $request, Contract $contract)
    {
        $user = Auth::user();
        if ($user->can('create', $contract)) {
            $contract = $contract->create($request->all());
//            return stripcslashes($contract->body);
            return compact('contract');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Contract $contract
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show(Contract $contract)
    {
        return compact('contract');
    }

    /**
     * @param Contract $contract
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|string
     */
    public function review(Report $report, Contract $contract, User $user)
    {
        $body = stripcslashes($contract->body);
        File::put('../resources/views/contract.blade.php', $body);

        $customerAnswers = CustomerAnswer::where('customer_id', $report->customer_id)->get();
        foreach ($customerAnswers as $customerAnswer) {
            $question = Question::find($customerAnswer->question_id);

            if ($question->block->survey_id == $report->survey_id) {
                $finalAnswer = CustomerAnswer::where('question_id', $question->id)->get();
                $contractAnswers[$question->id]  = $finalAnswer[0]->value;
            }
        }
        return view('contract', compact('contractAnswers', 'report'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ContractRequest|Request $request
     * @param Contract $contract
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(ContractRequest $request, Contract $contract)
    {
        $user = Auth::user();
        if ($user->can('update', $contract)) {
            $contract->update($request->all());
            return compact('contract');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Contract $contract
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Contract $contract)
    {
        $user = Auth::user();
        if ($user->can('delete', $contract)) {
            $contract->delete();
            return compact('contract');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * @param Report $report
     * @param Contract $contract
     * @return mixed
     */
    public function downloadContract(Report $report, Contract $contract)
    {
        $body = stripcslashes($contract->body);
        File::put('../resources/views/contract.blade.php', $body);

        $customerAnswers = CustomerAnswer::where('customer_id', $report->customer_id)->get();
        foreach ($customerAnswers as $customerAnswer) {
            $question = Question::find($customerAnswer->question_id);

            if ($question->block->survey_id == $report->survey_id) {
                $finalAnswer = CustomerAnswer::where('question_id', $question->id)->get();
                $contractAnswers[$question->id] = $finalAnswer[0]->value;
            }
        }
        $data['report'] = $report;
        $data['contractAnswers'] = $contractAnswers;

        $pdf = PDF::loadView('contract', $data);
        return $pdf->download('contract.pdf');
    }
}
