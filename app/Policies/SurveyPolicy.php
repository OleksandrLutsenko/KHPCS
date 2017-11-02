<?php
namespace App\Policies;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class SurveyPolicy
{
    use HandlesAuthorization;

    public function create(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function update(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function answerAll(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function delete(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function addBlock(User $user)
    {
        return Auth::user()->isAdmin();
    }
}