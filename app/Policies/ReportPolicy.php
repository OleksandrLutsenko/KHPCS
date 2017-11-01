<?php
namespace App\Policies;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;
class ReportPolicy
{
    use HandlesAuthorization;

    public function index(User $user)
    {
        return $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user)
    {
        return $user->isAdmin();
    }

    public function delete(User $user)
    {
        return $user->isAdmin();
    }
}