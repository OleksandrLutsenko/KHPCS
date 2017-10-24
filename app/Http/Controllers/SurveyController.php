<?php

namespace App\Http\Controllers;

use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function index(Survey $survey)
    {
            return Survey::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Survey $survey
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Survey $survey, Request $request)
    {
        if(Auth::user()->role_id == 2) {
            $survey = Survey::create($request->all());
            return response()->json($survey, 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show(Survey $survey)
    {
        return $survey;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, Survey $survey)
    {
        if(Auth::user()->role_id == 2) {
            $survey->update($request->all());
            return response()->json($survey, 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Survey $survey)
    {
        if(Auth::user()->role_id == 2) {
            $survey->delete();
            return response()->json(null, 204);
        }
    }
}
