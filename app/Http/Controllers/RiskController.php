<?php

namespace App\Http\Controllers;

use App\Risk;
use App\Survey;
use Illuminate\Http\Request;

class RiskController extends Controller
{
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
}
