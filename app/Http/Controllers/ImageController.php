<?php

namespace App\Http\Controllers;

use App\Contract;
use App\ContractResearch;
use App\Http\Requests\ImageRequest;
use App\Image;
use function GuzzleHttp\Psr7\uri_for;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param ImageRequest $request
     * @param Image $image
     * @param ContractResearch $contractResearch
     * @return \Illuminate\Http\Response
     * @internal param Contract $contract
     */
    public function upload(ImageRequest $request, Image $image, ContractResearch $contractResearch)
    {
        $file = $request->file('image_file');
        $filename = time().'.'.$file->getClientOriginalExtension();
        $file->move(storage_path('images'), $filename);

        $filePathUri = 'storage/images/' . $filename;
        $filePathUrl = url($filePathUri);

        $image = $contractResearch->images()->create($request->getImagePathAttribute($filePathUrl));

        return compact('image');
    }

    /**
     * @param ImageRequest $request
     * @param Image $image
     * @return $this|\Illuminate\Database\Eloquent\Model
     */
    public function reUpload(ImageRequest $request, ContractResearch $contractResearch, Image $image)
    {
        $fileUri = $image->link;
        File::delete('../'.$fileUri);

        $file = $request->file('image_file');
        $filename = time().'.'.$file->getClientOriginalExtension();
        $file->move(storage_path('images'), $filename);

        $filePathUri = 'storage/images/' . $filename;
        $filePathUrl = url($filePathUri);

        $image->update($request->getImagePathAttribute($filePathUri));

        return compact('image', 'filePathUrl');
    }

    /**
     * Display the specified resource.
     *
     * @param $filename
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show($filename)
    {
        $path = storage_path() .'/images/'. $filename;

        if(!File::exists($path)) {
            return response()->json(['message' => 'Image not found.'], 404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Image $image
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Image $image)
    {
        $fileUri = uri_for($image->link);

        File::delete('..'.$fileUri->getPath());

        $image->delete();
        return compact('image');
    }
}
