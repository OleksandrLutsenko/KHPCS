<?php

namespace App\Http\Controllers;

use App\User;
use App\Variable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VariableController extends Controller
{
    /**
     * @param Variable $variable
     * @param User $user
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Database\Eloquent\Collection|\Symfony\Component\HttpFoundation\Response|static[]
     * @internal param Survey $survey
     */
    public function index(Variable $variable, User $user)
    {
        $variable = Variable::where('user_id', Auth::user()->id)->get();
        return $variable;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request|Request $request
     * @param Variable $variable
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param Survey $survey
     */
    public function store(Request $request, Variable $variable, User $user)
    {
        $variable = $variable->create($request->all());
        return compact('variable');
    }

    /**
     * Display the specified resource.
     *
     * @param Variable $variable
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param Survey $survey
     * @internal param int $id
     */
    public function show(Variable $variable, User $user)
    {
        return compact('variable');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Variable $variable
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param Survey $survey
     * @internal param int $id
     */
    public function update(Request $request, Variable $variable, User $user)
    {
        $variable->update($request->all());
        return compact('variable');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Variable $variable
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param Survey $survey
     * @internal param int $id
     */
    public function destroy(Variable $variable, User $user)
    {
        $variable->delete();
        return compact('variable');
    }
}
