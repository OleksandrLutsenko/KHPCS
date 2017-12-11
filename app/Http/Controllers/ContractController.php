<?php

namespace App\Http\Controllers;

use App;
use App\Contract;
use App\ContractResearch;
use App\Customer;
use App\CustomerAnswer;
use App\Http\Requests\ContractRequest;
use App\Image;
use App\Question;
use App\Report;
use App\User;
use Dompdf\Dompdf;
use Response;
use PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use View;

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

    public function indexWithoutBody(Contract $contract, User $user)
    {
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
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ContractRequest|Request $request
     * @param Contract $contract
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
        return compact('contract');
    }

    /**
     * @param Contract $contract
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|string
     */
    public function review(Report $report, Contract $contract, User $user, $userFilename)
    {
        $variables = Auth::user()->variables;
        $body = stripcslashes($contract->body);
        File::put('../resources/views/contract.blade.php', $body);

        $customerAnswers = CustomerAnswer::withTrashed()->where('customer_id', $report->customer_id)->get();

        foreach ($customerAnswers as $customerAnswer) {
            $question = Question::withTrashed()->find($customerAnswer->question_id);

            if ($question->block->survey_id == $report->survey_id) {

                $finalAnswer = CustomerAnswer::withTrashed()->where('question_id', $question->id)->get();
                //
                if($question->trashed()){
                    $finalAnswer[0]->value = "<p style='color: red'>undefined value</p> ";
                }
                //
                $contractAnswers[$question->id] = $finalAnswer[0]->value;
            }

        }

        $view = Response::json(
            array(View::make('contract',
            compact('contractAnswers', 'variables', 'report'))->render())
        );
        $viewContent = $view->getOriginalContent();

//        $filename = 'contract_'.time().'.html';
        $filename = $userFilename.'.html';
//        $filenamePdf = 'contract_'.time().'.pdf';
        $filenamePdf = $userFilename.'.pdf';
        $filePathUri = 'storage/contracts/' . $filename;
        $filePathUriPdf = 'storage/contracts/' . $filenamePdf;
        $filePathUrl = url($filePathUri);
        $filePathUrlPdf = url($filePathUriPdf);
        $path = '../'.$filePathUri;
        $pathPdf = '../'.$filePathUriPdf;
        File::put($path, $viewContent);

        PDF::loadFile(storage_path().'/contracts/'.$filename)->setPaper('A4', 'landscape')->save(storage_path().'/contracts/'.$filenamePdf);

        File::delete($path);
        return compact('filenamePdf','filePathUrlPdf');
//        return view('contract', compact('contractAnswers', 'variables', 'report'));
    }

    public function deletePDF($filenamePdf)
    {
        File::delete(storage_path().'/contracts/'.$filenamePdf);
        return 'PDF file was deleted';
    }



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


            $images = Image::where('contract_research_id', $contract->contractResearch->id)->get();
//                dd($images);

//            $images = $contract->images;

            foreach ($images as $image){
                $fileUri = $image->link;
                File::delete('../'.$fileUri);
                $image->delete();
            }

            $contract->contractResearch->delete();

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
                    $finalAnswer[0]->value = "<p style='color: red'>undefined value</p> ";
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
