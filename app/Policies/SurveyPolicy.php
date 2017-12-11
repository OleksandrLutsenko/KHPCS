<?php
namespace App\Policies;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;
use JWTAuth;

class SurveyPolicy
{
    use HandlesAuthorization;

    public function index(User $user)
    {
        return Auth::user()->isAdmin();
    }

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