<?php

namespace App\Http\Controllers;

use App\Block;
use App\Customer;
use App\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockController extends Controller
{
//    /**
//     * Display a listing of the resource.
//     *
//     * @return \Illuminate\Http\Response
//     */
//    public function index(Block $block, Survey $survey)
//    {
//        $block = $survey->block()->get();
//        return $block;
//
//    }
//
//    /**
//     * Store a newly created resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @return \Illuminate\Http\Response
//     */
//    public function store(Request $request, Survey $survey)
//    {
//         if(Auth::user()->role_id == 2) {
//             $block = $survey->block()->create($request->all());
//             return response()->json($block, 201);
//         }
//    }
//
//    /**
//     * Display the specified resource.
//     *
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function show(Survey $survey, Block $block)
//    {
//        return $block;
//
//    }
//
//    /**
//     * Update the specified resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function update(Request $request, Survey $survey, Block $block)
//    {
//        if(Auth::user()->role_id == 2) {
//            $block->update($request->all());
//            return response()->json($block, 200);
//        }
//    }
//
//    /**
//     * Remove the specified resource from storage.
//     *
//     * @param  int  $id
//     * @return \Illuminate\Http\Response
//     */
//    public function destroy(Survey $survey, Block $block)
//    {
//        if(Auth::user()->role_id == 2) {
//            $block->delete();
//            return response()->json(null, 204);
//        }
//    }
//
//    public function customerIndex(Block $block, Customer $customer ,Survey $survey)
//    {
//        $block = $survey->block()->get();
//        return $block;
//
//    }
//
//    public function customerShow(Customer $customer, Survey $survey, Block $block)
//    {
//        return $block;
//
//    }



    /**
     * Display block's questions
     *
     * @param Block $block
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function show(Block $block)
    {
        return ['questions' => $block->question()->get(), 'block' => $block];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param Block $block
     * @return array
     */
    public function addQuestion(Request $request, Block $block)
    {
        $question = $block->question()->create($request->all());
        return compact('question');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Block $block
     * @param Request $request
     * @return array
     */
    public function update(Block $block, Request $request)
    {
        $block->update($request->all());

        return compact('block');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Block $block
     * @return array
     */
    public function destroy(Block $block)
    {
        $block->delete();
        return compact('block');
    }


}
