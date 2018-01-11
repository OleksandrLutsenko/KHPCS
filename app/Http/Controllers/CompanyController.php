<?php

namespace App\Http\Controllers;

use App\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $companies = Company::all();
        return response(['companies' => $companies], 200);
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
        $company = $company->create($request->all());
        return response(['company' => $company], 200);
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
        return response(['company' => $company], 200);
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
        $company->update($request->all());
        return response(['company' => $company], 201);
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
        $company->delete();
        return response(['company' => $company], 201);
    }
}
