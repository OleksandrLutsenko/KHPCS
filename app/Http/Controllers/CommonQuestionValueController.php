<?php

namespace App\Http\Controllers;

use App\CommonQuestionValue;
use Illuminate\Http\Request;

class CommonQuestionValueController extends Controller
{
    public function index()
    {
        $common_questions_value = CommonQuestionValue::all();

        return response()->json($common_questions_value, 200);
    }

    public function store(Request $request)
    {
        $common_question_value = CommonQuestionValue::create($request->all());

        return response()->json($common_question_value, 200);
    }

    public function update(Request $request)
    {
        $common_question_value = CommonQuestionValue::find($request->common_question_id);

        $common_question_value->update($request->all());

        return response()->json($common_question_value, 200);
    }

    public function destroy(Request $request)
    {
        $common_question_value = CommonQuestionValue::find($request->common_question_id);

        $common_question_value->delete();

        return response()->json($common_question_value, 200);
    }
}
