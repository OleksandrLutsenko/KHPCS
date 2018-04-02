<?php

namespace App\Http\Controllers;

use App\Company;
use App\Question;
use App\Risk;
use App\Survey;
use Illuminate\Http\Request;

class RiskController extends Controller
{
    public function index(Request $request)
    {
        $company = Company::find($request->company_id);
        $risks = $company->risks;

        return response()->json($risks, 200);
    }

    public function store(Survey $survey, Request $request)
    {
        $risk = $survey->risks()->create($request->all());

        return response()->json($risk, 200);
    }

    public function update(Risk $risk, Request $request)
    {
        $risk->update($request->all());

        return response()->json($risk, 200);
    }

    public function destroy(Risk $risk)
    {
        $risk->delete();

        return response()->json($risk, 200);
    }

    public function countValue(Request $request)
    {
        $questions = Question::whereIn('id', $request->questions_id)->get();

        $value = $questions->sum('risk_value');

        return response()->json($value, 200);
    }
}
