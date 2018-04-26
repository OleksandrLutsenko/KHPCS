<?php

namespace App;

use Illuminate\Support\Facades\Mail;
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

    public function getSurveysAttribute()
    {
        return $this->survey->name;
    }

    public function getContractAnswers($report)
    {
        $surveyQuestions = Survey::getSurveyQuestionsWithTrashed($report->survey);
        foreach ($surveyQuestions as $surveyQuestion) {

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

                $customerAnswer = CustomerAnswer::withTrashed()
                    ->where('question_id', $surveyQuestion->id)
                    ->where('customer_id', $report->customer_id)
                    ->first();

                if (!$customerAnswer) {
                    $contractAnswers[$surveyQuestion->id] = 'N/A';
                } else {
                    if ($surveyQuestion->trashed()) {
                        $deletedQuestionMessage = " ";
                        $contractAnswers[$surveyQuestion->id] = $deletedQuestionMessage;
                    } else {
                        if ($surveyQuestion->type == 3) {
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

    protected function getView($contractAnswers, $userVariables, $report, $customer, $user, $risk_value, $answer_additional_text)
    {
        return $view = Response::json(
            array(View::make('contract',
                compact('contractAnswers', 'userVariables', 'report', 'customer', 'user', 'risk_value', 'answer_additional_text'))->render())

        );
    }

    public function makeContractPDF($userFilename, $contractAnswers, $userVariables, $report, $customer, $user, $risk_value, $answer_additional_text, $send_email = false)
    {
        $this->makeContractFile();
        $view = $this->getView($contractAnswers, $userVariables, $report, $customer, $user, $risk_value, $answer_additional_text);

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

        if ($send_email) {
            return $filePathUrlPdf;
        }

        File::delete($path);

        return compact('filenamePdf', 'filePathUrlPdf');
    }

    public static function sendContract(Report $report, $userFilename = 'file')
    {
        $user = Auth::user();
        $customer = $report->customer;

        $company_survey = CompanySurvey::where([
            'company_id' => $customer->company_id,
            'survey_id' => $report->survey_id,
            'send_email' => 1
        ])->first();

        if ($company_survey != null) {
            if ($company_survey->send_email != 0) {
                $contract = Contract::find($company_survey->contract_id);
                if ($contract != null) {
                    $userVariables = Variable::getVariablesTextWithTrashed();
                    $contractAnswers = $contract->getContractAnswers($report);
                    $risk_value = Risk::riskValue($report);
                    $answer_additional_text = Answer::additionalText($report);

                    $path = $contract->makeContractPDF(
                        $userFilename,
                        $contractAnswers,
                        $userVariables,
                        $report,
                        $customer,
                        $user,
                        $risk_value,
                        $answer_additional_text,
                        $send_email = true
                    );

                    $letter['from'] = 'knights@gmail.com';
                    $letter['subject'] = 'Contract';
                    $letter['to'] = $user->email;
                    $letter['path'] = $path;

                    Mail::send('send-contract', compact($letter), function ($message) use ($letter){
                        $message->from($letter['from'])
                            ->attach($letter['path'], ['as' => 'report.pdf'])
                            ->to($letter['to'])
                            ->subject($letter['subject']);
                    });

                    File::delete(storage_path() . '/contracts/' . $userFilename . 'pdf');
                }
            }
        }
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
