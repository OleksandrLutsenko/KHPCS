<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class ContractPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function create(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function update(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function saveImage(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function delete(User $user)
    {
        return Auth::user()->isAdmin();
    }
}
