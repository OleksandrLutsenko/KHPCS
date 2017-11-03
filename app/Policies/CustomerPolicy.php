<?php
namespace App\Policies;
use App\Customer;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class CustomerPolicy
{
    use HandlesAuthorization;

    public function delete(User $user)
    {
        return Auth::user()->isAdmin();
    }

    public function show(User $user, Customer $customer)
    {
        if (Auth::user()->id === $customer->user_id){
            return true;
        }else{
            return false;
        }
    }
}