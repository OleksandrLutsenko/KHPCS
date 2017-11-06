<?php

namespace App\Http\Controllers;

use App\Block;
use App\Customer;
use App\Question;
use App\Survey;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    /**
     * Show question's answers
     *
     * @param Question $question
     * @return array
     */
    public function show(Question $question, User $user)
    {
        if ($user->can('show', $question)) {
            $answers = $question->answers;
//        $question->makeHidden(['customer_answers']);
//        return response()->json($question);
            return compact('question');
        }
        else{
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Question $question
     * @param Request $request
     * @param User $user
     * @return array
     */

    public function addAnswer(Question $question, Request $request, User $user)
    {
        if ($user->can('addAnswer', $question)) {
            if($question->hasRadioAnswer()) {
                $answer = $question->answer()->create($request->all());

                return compact('answer');
            }
            else{
            return response([
                'errors' => 'This is not the radio type question'
            ], 400);

            }
        }
        else{
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Update question
     *
     * @param Question $question
     * @param Request $request
     * @param User $user
     * @return array
     */
    public function update(Question $question, Request $request, User $user)
    {
        if ($user->can('update', $question)) {
            $question->update($request->all());
            return compact('question');
        }else{
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Question $question
     * @param User $user
     * @return array
     */
    public function destroy(Question $question, User $user)
    {
        if ($user->can('delete', $question)) {
            $question->delete();
            return compact('question');
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

        public function customerShow(Customer $customer, Question $question)
    {
        $answers = $question->answers;
        return compact('question');
    }
}

