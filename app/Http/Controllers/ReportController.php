<?php

namespace App\Http\Controllers;

use App\Report;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param User $user
     * @internal param Report $Report
     */
    public function index(Report $report, User $user)
    {
        if ($user->can('index', $report)) {
            return $report::all();
        }else{
            abort(404);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Report $report
     * @param  \Illuminate\Http\Request $request
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function store(Report $report, Request $request, User $user)
    {
        if ($user->can('create', $report)) {
            $report = Report::create($request->all());
            return response()->json($report, 201);
        }else{
            abort(404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */

    public function update(Request $request, Report $report, User $user)
    {
        if ($user->can('update', $report)) {
            $report->update($request->all());
            return response()->json($report, 200);
        }else{
            abort(404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Report $report
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Report $report, User $user)
    {
        if ($user->can('update', $report)) {
            $report->delete();
            return response()->json(null, 204);
        }else{
            abort(404);
        }
    }
}
