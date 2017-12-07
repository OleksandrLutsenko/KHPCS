<?php

namespace App\Http\Controllers;

use App\ContractResearch;
use App\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

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
        $images = $contractResearch->images;

        foreach ($images as $image){
            $fileUri = $image->link;
            File::delete('../'.$fileUri);

            $image->delete();
        }

        $contractResearch->delete();
        return response()->json(null, 204);
    }
}
