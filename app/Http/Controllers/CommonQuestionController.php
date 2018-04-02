<?php

namespace App\Http\Controllers;

use App\CommonQuestion;
use Illuminate\Http\Request;

class CommonQuestionController extends Controller
{
    public function index()
    {
        $common_questions = CommonQuestion::all();

        return response()->json($common_questions, 200);
    }

    public function store(Request $request)
    {
        $common_question = CommonQuestion::create($request->all());

        return response()->json($common_question, 200);
    }

    public function update(Request $request)
    {
        $common_question = CommonQuestion::find($request->common_question_id);

        $common_question->update($request->all());

        return response()->json($common_question, 200);
    }

    public function destroy(Request $request)
    {
        $common_question = CommonQuestion::find($request->common_question_id);

        $common_question->delete();

        return response()->json($common_question, 200);
    }
}
