<?php

namespace App\Http\Controllers;

use App;
use App\CompanySurvey;
use App\Contract;
use App\ContractResearch;
use App\CustomerAnswer;
use App\Http\Requests\ContractRequest;
use App\Image;
use App\Question;
use App\Report;
use App\Survey;
use App\User;
use App\Variable;
use Response;
use PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

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
        if (Auth::user()->isAdmin()) {
            return Contract::all();
        } else {
            $assigned = CompanySurvey::where('company_id', Auth::user()->company_id)
                ->select('contract_id')
                ->get();
            return Contract::whereIn('id', $assigned)->get();
        }
    }

    public function indexForSurvey(Contract $contract, User $user, Survey $survey)
    {
        if (Auth::user()->isAdmin()) {
            return Contract::where('survey_id', $survey->id)
                ->select('id', 'title', 'survey_id', 'contract_research_id')
                ->get();
        } else {
            $assigned = CompanySurvey::where('company_id', Auth::user()->company_id)
                ->where('survey_id', $survey->id)
                ->select('contract_id')
                ->get();

                return Contract::whereIn('id', $assigned)->get();
        }
//        return Contract::where('survey_id', $survey->id)->get();
    }

    public function indexWithoutBody(Contract $contract, User $user)
    {
        if (Auth::user()->isAdmin()) {

            $contracts = Contract::all();
            foreach ($contracts as $contract){
                $contractsWithoutBody[] = [
                    'id' => $contract->id,
                    'title' => $contract->title,
                    'survey_id' => $contract->survey_id,
                    'contract_research_id' => $contract->contract_research_id
                ];
            }
            return compact('contractsWithoutBody');
        } else {
            $assigned = CompanySurvey::where('company_id', Auth::user()->company_id)
                ->select('contract_id')
                ->get();
            $contracts = Contract::whereIn('id', $assigned)->get();
            foreach ($contracts as $contract) {
                $contractsWithoutBody[] = [
                    'id' => $contract->id,
                    'title' => $contract->title,
                    'survey_id' => $contract->survey_id,
                    'contract_research_id' => $contract->contract_research_id
                ];
            }
            return compact('contractsWithoutBody');
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ContractRequest|Request $request
     * @param Contract $contract
     * @param ContractResearch $contractResearch
     * @return \Illuminate\Http\Response
     */
    public function store(ContractRequest $request, Contract $contract, ContractResearch $contractResearch)
    {
        $user = Auth::user();
        if ($user->can('create', $contract)) {
            $contract = $contractResearch->contract()->create($request->all());
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
        if (Auth::user()->isAdmin()) {
            return compact('contract');
        } else {
            $assigned = CompanySurvey::where('company_id', Auth::user()->company_id)
                ->where('contract_id', $contract->id)
                ->first();
            if ($assigned) {
                return compact('contract');
            } else {
                return response(['message' => 'Page not found'], 404);
            }
        }
    }
    

    public function review(Report $report, Contract $contract, $userFilename)
    {
        $user = Auth::user();
        $customer = $report->customer;
        $userVariables = Variable::getVariablesTextWithTrashed();
        $contractAnswers = $contract->getContractAnswers($report);
        return $contract->makeContractPDF(
            $userFilename,
            $contractAnswers,
            $userVariables,
            $report,
            $customer,
            $user);
    }

    public function usedImages(Contract $contract) {
        $images = Image::where('contract_research_id', $contract->contractResearch->id)->get();
        return response(['imageList' => $images], 200);
    }

    /**
     * @param $filenamePdf
     * @return string
     */
    public function deletePDF($filenamePdf)
    {
        File::delete(storage_path().'/contracts/'.$filenamePdf);
        return 'PDF file was deleted';
    }

    /**
     * @param $filename
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function showPDF($filename)
    {
        $path = storage_path().'/contracts/'.$filename;

        if(!File::exists($path)) {
            return response()->json(['message' => 'PDF not found.'], 404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);

        return $response;
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
        $variables = Auth::user()->variables;
        $body = stripcslashes($contract->body);
        File::put('../resources/views/contract.blade.php', $body);

        $customerAnswers = CustomerAnswer::where('customer_id', $report->customer_id)->get();
        foreach ($customerAnswers as $customerAnswer) {
            $question = Question::find($customerAnswer->question_id);

            if ($question->block->survey_id == $report->survey_id) {
                $finalAnswer = CustomerAnswer::where('question_id', $question->id)->get();
                //
                if($question->trashed()){
//                    $finalAnswer[0]->value = "<p style='color: red'>undefined value</p> ";
                    $finalAnswer[0]->value = '';
                }
                //
                $contractAnswers[$question->id] = $finalAnswer[0]->value;
            }
        }
        $data['report'] = $report;
        $data['contractAnswers'] = $contractAnswers;
        $data['variables'] = $variables;

        $pdf = PDF::loadView('contract', $data);
        return $pdf->download('contract.pdf');
    }
}
