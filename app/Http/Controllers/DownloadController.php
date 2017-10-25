<?php

namespace App\Http\Controllers;

use PDF;

class DownloadController extends Controller
{
    public function download(){
        $pdf = PDF::loadView('pdf');
        return $pdf->download('clients.pdf');
    }
}
