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
        if (Auth::user()->role_id === 2){
            return true;
        }else{
            return false;
        }
    }
    public function create(User $user)
    {
        if (Auth::user()->role_id === 2){
            return true;
        }else{
            return false;
        }
    }
    public function update(User $user)
    {
        if (Auth::user()->role_id === 2){
            return true;
        }else{
            return false;
        }
    }
    public function delete(User $user)
    {
        if (Auth::user()->role_id === 2){
            return true;
        }else{
            return false;
        }
    }
}