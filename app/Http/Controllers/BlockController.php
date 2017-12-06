<?php

namespace App\Http\Controllers;

use App\Block;
use App\Customer;
use App\Http\Requests\BlockRequest;
use App\Http\Requests\QuestionRequest;
use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockController extends Controller
{
    /**
     * Display block's questions
     *
     * @param Block $block
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function show(Block $block, User $user)
    {
        if ($user->can('show', $block)) {
//            return ['questions' => $block->question()->get(), 'block' => $block];
            return compact('block');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param QuestionRequest $request
     * @param Block $block
     * @param User $user
     * @return array
     * @internal param $QuestionRequest
     */
    public function addQuestion(QuestionRequest $request, Block $block, User $user)
    {
        if ($user->can('addQuestion', $block)) {
            $question = $block->question()->create($request->all());
            return compact('question');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Block $block
     * @param BlockRequest $request
     * @param User $user
     * @return array
     */
    public function update(Block $block, BlockRequest $request, User $user)
    {
        if ($user->can('update', $block)) {
            $block->update($request->all());

            return compact('block');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Block $block
     * @param User $user
     * @return array
     */
    public function destroy(Block $block, User $user)
    {
        if ($user->can('delete', $block)) {

            $questions = $block->question;
            foreach ($questions as $question){
                $question->delete();
            }
            $block->delete();
            return compact('block');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * @param Customer $customer
     * @param Block $block
     * @return array
     */
    public function customerShow(Customer $customer, Block $block)
    {
//        return ['questions' => $block->question()->get(), 'block' => $block];
        return compact('block');
    }
}
