<?php
namespace App\Policies;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class QuestionPolicy
{
    use HandlesAuthorization;

    public function show(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function create(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function update(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function addAnswer(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function delete(User $user)
    {
        return Auth::user()->isAdmin();
    }
}