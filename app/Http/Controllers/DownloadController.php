<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Report;
use App\Survey;
use PDF;

class DownloadController extends Controller
{
    public function downloadPDF(){
        $pdf = PDF::loadView('pdf');
        return $pdf->download('clients.pdf');
    }

    public function downloadSurvey(Customer $customer, Survey $survey){

        $data['customer'] = $customer;
        $data['survey'] = $survey;

        $data['reports'] = Report::where('customer_id', $customer->id)->where('survey_id', $survey->id)->get();


        $pdf = PDF::loadView('answer-customers', $data);
        return $pdf->download('customer-answers.pdf');

    }
}
