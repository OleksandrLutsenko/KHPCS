<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Block;
use App\Customer;
use App\Http\Requests\BlockRequest;
use App\Http\Requests\QuestionRequest;
use App\Question;
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
     * @param Request $request
     * @param Block $block
     * @param User $user
     * @return array|\Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function addQuestionsBlock(Request $request, Block $block, User $user)
    {
        if ($user->can('addQuestion', $block)) {
            $requests = $request->all();
//            dd($request);
            foreach ($requests as $questionObj) {

                if (isset($questionObj['id'])){
                    $question = Question::find($questionObj['id']);
                    if (isset($questionObj['delete']) && $questionObj['delete'] == true){
                        $question->delete();
                    } else {
                        $question->update($questionObj);
                        if ($question->type == 1) {
                            if (isset($questionObj['answers'])) {
                                foreach ($questionObj['answers'] as $answerObj) {

                                    if (isset($answerObj['id'])) {
                                        $answer = Answer::find($answerObj['id']);
                                        if (isset($answerObj['delete']) && $answerObj['delete'] == true) {
                                            $answer->delete();
                                        } else {
                                            $answer->update($answerObj);

                                            if (!empty($answerObj['child_questions'])) {

                                                foreach ($answerObj['child_questions'] as $childQuestionObj) {
                                                    if (isset($childQuestionObj['id'])) {
                                                        $childQuestion = Question::find($childQuestionObj['id']);
                                                        if (isset($childQuestionObj['delete']) && $childQuestionObj['delete'] == true){
                                                            $childQuestion->delete();
                                                        } else {
                                                            $childQuestion->update($childQuestionObj);
                                                            $childQuestion->parent_answer_id = $answer->id;
                                                            $childQuestion->save();
                                                        }
                                                    } else {
                                                        $childQuestion = $block->question()->create($childQuestionObj);
                                                        $childQuestion->parent_answer_id = $answer->id;
                                                        $childQuestion->save();
                                                    }
                                                }

                                            }
                                        }
                                    } else {
                                        $answer = $question->answer()->create($answerObj);
                                        if (!empty($answerObj['child_questions'])){
                                            foreach ($answerObj['child_questions'] as $childQuestionObj){
                                                if (isset($childQuestionObj['id'])){
                                                    $childQuestion = Question::find($childQuestionObj['id']);
                                                    $childQuestion->parent_answer_id = $answer->id;
                                                    $childQuestion->save();
                                                } else {
                                                    $childQuestion = $block->question()->create($childQuestionObj);
                                                    $childQuestion->parent_answer_id = $answer->id;
                                                    $childQuestion->save();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //Question without id
                } else {
                    $question = $block->question()->create($questionObj);
                    if ($question->type == 1) {
                        //Answers for question without id
                        if (isset($questionObj['answers'])) {
                            foreach ($questionObj['answers'] as $answerObj){
                                $answer = $question->answer()->create($answerObj);
                                //childQuestions
                                if (!empty($answerObj['child_questions'])){
                                    foreach ($answerObj['child_questions'] as $childQuestionObj){
                                        //childQuestion with id
                                        if (isset($childQuestionObj['id'])){
                                            $childQuestion = Question::find($childQuestionObj['id']);
                                            $childQuestion->update($childQuestionObj);
                                            $childQuestion->parent_answer_id = $answer->id;
                                            $childQuestion->save();
                                        //childQuestion without id
                                        } else {
                                            $childQuestion = $block->question()->create($childQuestionObj);
                                            $childQuestion->parent_answer_id = $answer->id;
                                            $childQuestion->save();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $questions[] = $question;
            }
            return compact('questions');
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

//            $questions = $block->question;
//            foreach ($questions as $question){
//                $question->delete();
//            }
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
