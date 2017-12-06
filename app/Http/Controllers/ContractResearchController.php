<?php

namespace App\Http\Controllers;

use App\ContractResearch;
use Illuminate\Http\Request;

class ContractResearchController extends Controller
{
    /**
     * @param ContractResearch $contractResearch
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ContractResearch $contractResearch, Request $request)
    {
        $contractResearch = ContractResearch::create($request->all());
        return response()->json($contractResearch, 201);
    }

    public function destroy(ContractResearch $contractResearch)
    {
        $contractResearch->delete();
        return response()->json(null, 204);
    }
}
