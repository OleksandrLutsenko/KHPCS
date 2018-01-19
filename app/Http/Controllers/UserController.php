<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UserRequest;
use App\Invite;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use JWTAuth;
use App\User;
use JWTAuthException;

class UserController extends Controller
{

    private $user;

    public function __construct(User $user){
        $this->user = $user;
    }

    /**
     * @param UserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(UserRequest $request, $key){
        $invite = Invite::where('key', $key)
            ->where('is_used', 0)
            ->first();
        if($invite){
            $user = User::onlyTrashed()->where('email', $invite->email)->first();
            if ($user) {
                $user->update([
                    'deleted_at' => null,
                    'name' => $request->get('name'),
                    'password' => bcrypt($request->get('password')),
                    'email' => $invite->email,
                    'role_id' => $invite->role_id,
                    'company_id' => $invite->company_id
                ]);

                $user = User::find($user->id);
                $user->activateInvite();
            } else {
                $user = $this->user->create([
                    'name' => $request->get('name'),
                    'password' => bcrypt($request->get('password')),
                    'email' => $invite->email,
                    'role_id' => $invite->role_id,
                    'company_id' => $invite->company_id
                ]);

                $user->activateInvite();
            }
            return response(['message' => 'User created successfully', 'user' => $user,], 200);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
        $credentials = $request->only('email', 'password');
        $token = null;
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['invalid_email_or_password'], 422);
            }
        } catch (JWTAuthException $e) {
            return response()->json(['failed_to_create_token'], 500);
        }
    return response()->json(compact('token'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthUser(Request $request){
        $user = JWTAuth::toUser($request->token);
        return response()->json(['result' => $user]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request) {
        $this->validate($request, ['token' => 'required']);
        try {
            JWTAuth::invalidate($request->input('token'));
            return response()->json(['success' => true]);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'error' => 'Failed to logout, please try again.'], 500);
        }
    }

    /**
     * @param User $user
     * @param UpdateUserRequest $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function update(User $user, UpdateUserRequest $request) {
        if (Auth::user()->id == $user->id) {
            if ($request['password']){
                return $request->changePassword($user);
            }
//            if($request['company_id']) {
//                return $request->changeCompany($user);
//            }
            return $request->changeNameAndEmail($user);
        } else {
            return response('Page is not found', 404);
        }
    }

//    public function changeUserCompany(User $user, UpdateUserRequest $request)
//    {
//        $request->changeCompany($user);
//    }

    public function updateRole(User $user, UpdateUserRequest $request)
    {
        if (Auth::user()->isAdmin() and $request['role_id'] == 1 or $request['role_id'] == 3) {
            return $request->changeRole($user);
        } else {
            return response(['message' => 'You do not have a permission'], 400);
        }
    }

    public function showFAs(User $user)
    {
        if (Auth::user()->isCompanyAdmin()) {
            if(Auth::user()->company_id == $user->company_id){
                return response($user, 200);
            }
        }
        if (Auth::user()->isAdmin()) {
            return response($user, 200);
        }
    }

    public function delete(User $user)
    {
        if (Auth::user()->isAdmin() and $user->role_id == 1 or $user->role_id == 3) {
            $user->delete();
            return response(['message' => 'User was deleted'], 200);
        }
        elseif (Auth::user()->isCompanyAdmin() and $user->role_id == 1) {
            $user->delete();
            return response(['message' => 'User was deleted'], 200);
        } else {
            return response(['message' => 'You do not have a permission'], 400);
        }

    }
}
