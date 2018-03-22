<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class InvitePolicy
{
    use HandlesAuthorization;

    public function sendInvite(User $user)
    {
        if (Auth::user()->isAdmin() or Auth::user()->isCompanyAdmin()) {
            return true;
        } else {
            return false;
        }
    }
}
