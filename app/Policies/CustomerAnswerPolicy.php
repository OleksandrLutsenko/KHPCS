<?php
namespace App\Policies;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class CustomerAnswerPolicy
{
    use HandlesAuthorization;

    public function show(User $user)
    {
        return Auth::user()->isAdmin();
    }
}