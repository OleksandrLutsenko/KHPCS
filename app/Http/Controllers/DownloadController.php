<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Report;
use App\Survey;
use PDF;

class DownloadController extends Controller
{
    public function downloadReport(Report $report){

        $data['customer'] = $report->customer;
        $data['survey'] = $report->survey;
        $data['reports'] = $report;

        $pdf = PDF::loadView('answer-customers', $data);
//        $pdf = PDF::loadView('contract', $data);
        return $pdf->download('report.pdf');
    }
}
