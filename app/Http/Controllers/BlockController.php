<?php

namespace App\Http\Controllers;

use App\Block;
use App\Customer;
use App\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockController extends Controller
{
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
