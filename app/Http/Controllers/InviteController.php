<?php

namespace App\Http\Controllers;

use App\Company;
use App\Invite;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InviteController extends Controller
{
    public function createAndSendInvite(Request $request, Invite $invite)
    {
        $user = Auth::user();
        if ($user->can('sendInvite', $invite)) {
            $oldInvite = Invite::where('email', $request['email'])->first();
            if ($oldInvite) {
                if ($oldInvite->is_used == 1) {
                    return response(['message' => 'This email is already registered'], 400);
                } elseif ($oldInvite->is_used == 0) {
                    $oldInvite->update(['key' => Invite::generateInviteKey()]);
                    $invite = $oldInvite;
                }
            } else {
                $invite = $invite->create($request->all());
            }
            $company = Company::find($invite->company_id);
            $role = Role::find($invite->role_id);
            return $invite->sendInvite($company, $invite->email, $role, $invite->key);
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }

    public function indexInvite(Invite $invite)
    {
        if(Auth::user()->isAdmin()) {
            return $invite->orderByDesc('updated_at')->get();
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }

    }

}
