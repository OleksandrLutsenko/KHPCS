<?php

namespace App\Http\Controllers;

use App\Company;
use App\CompanySurvey;
use App\Survey;
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
            $companies = Company::latest()->get();
            return response(['companies' => $companies], 200);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    public function getAvailableSurveys(Company $company)
    {
        $companySurveys = CompanySurvey::where('company_id', $company->id)->get()->toArray();
        $surveysId = array_values(array_unique(array_column($companySurveys, 'survey_id')));
        $surveys = Survey::whereIn('id', $surveysId)->where('status', '!=', 0)->get();
        $surveysObj = [];
        foreach($surveys as $survey) {
            $surveysObj[] = [
                'id' => $survey->id,
                'name' => $survey->name
            ];
        }
        return response($surveysObj);
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
            $company->setAppends(['company_admin', 'financial_advisors', 'financial_advisors_invites']);
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

    public function indexAssigns(Company $company)
    {
        return $company->companySurveys->all();
    }

    public function activeSendEmail(Request $request)
    {
        $company_survey = CompanySurvey::where([
            'company_id' => $request->company_id,
            'survey_id' => $request->survey_id,
            'contract_id' => $request->contract_id
        ])->first();

        if ($company_survey->send_email == 1) {
            return response(['message' => 'Success'], 200);
        }

        if ($company_survey != null) {

            $other_company_surveys = CompanySurvey::where([
                'company_id' => $request->company_id,
                'survey_id' => $request->survey_id
            ])->get();

            foreach ($other_company_surveys as $other_company_survey) {
                $other_company_survey->send_email = 0;
                $other_company_survey->save();
            }

            $company_survey->send_email = 1;
            $company_survey->save();

            return response(['message' => 'Success'], 200);

        } else {
            return response(['message' => 'Not found'], 404);
        }
    }

    public function deactivateSendEmail(Request $request)
    {
        $company_survey = CompanySurvey::where([
            'company_id' => $request->company_id,
            'survey_id' => $request->survey_id,
            'contract_id' => $request->contract_id
        ])->first();

        if ($company_survey->send_email == 0) {
            return response(['message' => 'Success'], 200);
        }

        if ($company_survey != null) {

            $company_survey->send_email = 0;
            $company_survey->save();

            return response(['message' => 'Success'], 200);

        } else {
            return response(['message' => 'Not found'], 404);
        }
    }
}
