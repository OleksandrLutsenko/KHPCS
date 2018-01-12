<?php

namespace App\Http\Controllers;

use App\Company;
use App\CompanySurvey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::user()->isAdmin()) {
            $companies = Company::all();
            return response(['companies' => $companies], 200);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Company $company
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Company $company)
    {
        if (Auth::user()->isAdmin()) {
            $company = $company->create($request->all());
            return response(['company' => $company], 200);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Company $company
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show(Company $company)
    {
        if (Auth::user()->isAdmin()) {
            $company->setAppends([
                'company_admin_invites', 'financial_advisors_invites',
                'company_admin', 'financial_advisors'
            ]);
            return response(['company' => $company], 200);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    public function showOwn(Company $company)
    {
        if (Auth::user()->isCompanyAdmin()) {
            $company = Company::find(Auth::user()->company_id);
            $company->setAppends(['company_admin', 'financial_advisors']);
            return response(['company' => $company], 200);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Company $company
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, Company $company)
    {
        if (Auth::user()->isAdmin()) {
            $company->update($request->all());
            return response(['company' => $company], 201);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Company $company
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Company $company)
    {
        if (Auth::user()->isAdmin()) {
            $company->delete();
            return response(['company' => $company], 201);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    public function assignSurveyAndContracts(Request $request, Company $company)
    {
        if (Auth::user()->isAdmin()) {
            foreach ($request->all() as $assign) {
                $oldAssign = CompanySurvey::where('company_id', $company->id)
                    ->where('survey_id', $assign['survey_id'])
                    ->where('contract_id', $assign['contract_id'])
                    ->first();
                if (!$oldAssign) {
                    $company->companySurveys()->create($assign);
                }
                if ($oldAssign and $assign['delete'] and $assign['delete'] == true) {
                    $oldAssign->delete();
                }
            }
            $assigned = CompanySurvey::where('company_id', $company->id)->get();
           return response(['assigned' => $assigned], 201);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }
}
