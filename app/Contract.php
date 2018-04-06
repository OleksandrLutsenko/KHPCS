<?php

namespace App;

use PDF;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Response;
use View;

/**
 * @property mixed body
 */
class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'body', 'survey_id'];

    protected $visible = ['id', 'surveys', 'title', 'body', 'survey_id', 'contract_research_id'];

    protected $appends = ['surveys'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function companySurveys(){
        return $this->hasMany(CompanySurvey::class);
    }

    public function contractResearch(){
        return $this->belongsTo(ContractResearch::class);
    }

    /**
     * @return mixed
     */
    public function getSurveysAttribute()
    {
        return $this->survey->name;
    }

//    public function getContractAnswers($report)
//    {
//        $surveyQuestions = Survey::getSurveyQuestionsWithTrashed($report->survey);
//        foreach ($surveyQuestions as $surveyQuestion) {
//            $customerAnswer = CustomerAnswer::withTrashed()
//                ->where('question_id', $surveyQuestion->id)
//                ->where('customer_id', $report->customer_id)
//                ->first();
//
//            if (!$customerAnswer) {
//                $contractAnswers[$surveyQuestion->id] = 'N/A';
//            } else {
//                if ($surveyQuestion->trashed()) {
//                    $deletedQuestionMessage = "<span style='background-color: red'>question was deleted</span>";
//                    $contractAnswers[$surveyQuestion->id] = $deletedQuestionMessage;
//                } else {
//                    $contractAnswers[$surveyQuestion->id] = $customerAnswer->value;
//                }
//            }
//        }
//        return $contractAnswers;
//    }

    public function getContractAnswers($report)
    {
        $surveyQuestions = Survey::getSurveyQuestionsWithTrashed($report->survey);
        foreach ($surveyQuestions as $surveyQuestion) {
//////////
            if ($surveyQuestion->type == 0) {
                if ($surveyQuestion->trashed()) {
                    $deletedQuestionMessage = "<span style='background-color: red'>question was deleted</span>";
                    $contractAnswers[$surveyQuestion->id] = $deletedQuestionMessage;
                } else {
                    $customerAnswerArr = CustomerAnswer::where('customer_id', $report->customer_id)
                        ->where('question_id', $surveyQuestion->id)
                        ->get();

                    if ($customerAnswerArr->isEmpty()) {
                        $contractAnswers[$surveyQuestion->id] = 'N/A';
                    } else {
                        $customerAnswerArrOfValues = [];
                        foreach ($customerAnswerArr as $customerAnswerArr1) {
                            $customerAnswerArrOfValues[] = $customerAnswerArr1->value;
                        }
                        $customerAnswerStr = implode(", ", $customerAnswerArrOfValues);
                        $contractAnswers[$surveyQuestion->id] = $customerAnswerStr;
                    }
                }
            } else {

//////////
                $customerAnswer = CustomerAnswer::withTrashed()
                    ->where('question_id', $surveyQuestion->id)
                    ->where('customer_id', $report->customer_id)
                    ->first();

                if (!$customerAnswer) {
                    $contractAnswers[$surveyQuestion->id] = 'N/A';
                } else {
                    if ($surveyQuestion->trashed()) {
//                        $deletedQuestionMessage = "<span style='background-color: red'>question was deleted</span>";
                        $deletedQuestionMessage = " ";
                        $contractAnswers[$surveyQuestion->id] = $deletedQuestionMessage;
                    } else {
                        if ($surveyQuestion->type == 3) {
//                            $customerAnswer->value = date('d-m-Y', strtotime($customerAnswer->value));
                            $contractAnswers[$surveyQuestion->id] = date('d-m-Y', strtotime($customerAnswer->value));
                        } else {
                            $contractAnswers[$surveyQuestion->id] = $customerAnswer->value;
                        }
                    }
                }
            }
        }
        return $contractAnswers;
    }

    protected function makeContractFile()
    {
        $body = stripcslashes($this->body);
        File::put('../resources/views/contract.blade.php', $body);
    }

    protected function getView($contractAnswers, $userVariables, $report, $customer, $user, $risk_value)
    {
        return $view = Response::json(
            array(View::make('contract',
                compact('contractAnswers', 'userVariables', 'report', 'customer', 'user', 'risk_value'))->render())

        );
    }

    public function makeContractPDF($userFilename, $contractAnswers, $userVariables, $report, $customer, $user, $risk_value)
    {
        $this->makeContractFile();
        $view = $this->getView($contractAnswers, $userVariables, $report, $customer, $user, $risk_value);

        $viewContent = $view->getOriginalContent();
        $filename = $userFilename . '.html';
        $filenamePdf = $userFilename . '.pdf';
        $filePathUri = 'storage/contracts/' . $filename;
        $filePathUriPdf = 'storage/contracts/' . $filenamePdf;
        $filePathUrlPdf = url($filePathUriPdf);
        $path = '../' . $filePathUri;
        File::put($path, $viewContent);

        PDF::loadFile(storage_path() . '/contracts/' . $filename)
            ->setPaper('A4', 'portrait')
            ->save(storage_path() . '/contracts/' . $filenamePdf);

        File::delete($path);


//        $attachment_location = $_SERVER["DOCUMENT_ROOT"] . "/storage/contracts/". $filenamePdf;
//
//            header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
//            header("Content-Type: application/pdf");
//            header("Content-Length:".filesize($attachment_location));
//            header("Content-Disposition: attachment; filename=".$filenamePdf);
//            return $attachment_location;

//        $pdf = PDF::loadView('contract', compact('contractAnswers', 'userVariables', 'report', 'customer', 'user'));
//        return $pdf->download('contract.pdf');

        return compact('filenamePdf', 'filePathUrlPdf');

//        return response(['filePathUrlPdf' => $filePathUrlPdf]);


//        $headers = ['Content-Type: application/pdf'];
//        $newName = 'itsolutionstuff-pdf-file-'.time().'.pdf';

//        $lol = storage_path() . '/contracts/' . $filenamePdf;
//        return response()->download($lol, $newName, $headers, 'inline');
//        return response()->download(storage_path('contracts/'.$filenamePdf));
//        return redirect()->route('pdf', $filenamePdf);
//        return \Redirect::away('http://api.knightshayes.grassbusinesslabs.tk/storage/contracts/nasdsada_asd1_Test_survey_100000_test_a4_DONT_REMOVE!!!1514369241098.pdf');
//        return \Redirect::to($filePathUrlPdf);
    }

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($contract) {
            $contractResearch = $contract->contractResearch;
            $images = $contractResearch->images;
            $companySurveys = $contract->companySurveys;
            foreach ($images as $image){
                $fileUri = $image->link;
                File::delete('../'.$fileUri);
                $image->delete();
            }
            $contractResearch->delete();
            foreach ($companySurveys as $companySurvey) {
                $companySurvey->delete();
            }
        });
    }

}
