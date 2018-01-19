<?php

namespace App\Http\Controllers;

use App\Company;
use App\Invite;
use App\Role;
use App\User;
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
                if ($request['role_id'] == 1 or $request['role_id'] == 3) {
                    $invite = $invite->create($request->all());
                } else {
                    return response(['message' => 'SuperAdmin role can not be assigned'], 400);
                }
            }
            $company = Company::find($invite->company_id);
            $role = Role::find($invite->role_id);
            return $invite->sendInvite($company, $invite->email, $role, $invite->key, $invite);
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }
    }



    public function A(Request $request, Invite $invite)
    {
        $user = Auth::user();
        if ($user->can('sendInvite', $invite)) {
            $oldInvite = Invite::where('email', $request['email'])->first();
            if ($oldInvite) {
                return response(['message' => 'This email is already registered'], 400);
            } else {
                if ($request['role_id'] == 1 or $request['role_id'] == 3) {
                    $invite = $invite->create($request->all());
                } else {
                    return response(['message' => 'SuperAdmin role can not be assigned'], 400);
                }
            }
            $company = Company::find($invite->company_id);
            $role = Role::find($invite->role_id);
            return $invite->sendInvite($company, $invite->email, $role, $invite->key, $invite);
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

    public function deleteInvite(Invite $invite)
    {
        if(Auth::user()->isAdmin() or Auth::user()->isCompanyAdmin()) {
            if ($invite->is_used == 0) {
                $invite->delete();
            }
            return response(['message' => 'Invite was deleted'], 200);
        } else {
            return response([
                "error" => "You do not have a permission"], 404
            );
        }

    }
}
