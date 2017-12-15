<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetEmailRequest;
use App\PasswordReset;
use App\Transformers\Json;
use App\User;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;

class ForgotPasswordController extends Controller
{
    use Notifiable;
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function getResetToken(Request $request){
        $this->validate($request, ['email' => 'required|email']);
        if ($request->wantsJson()) {
            $user = User::where('email', $request->input('email'))->first();
            if ($user) {
                $token = JWTAuth::fromUser($user);

                $oldPasswordResets = PasswordReset::where('email', $user->email)->delete();

                $passwordResets = new PasswordReset;
                $passwordResets->email = $user->email;
                $passwordResets->token = $token;
                $passwordResets->save();
//                $token = $this->broker()->createToken($user);
                $user->sendLinkToReset($token, $user);
                return response('Message was sent!', 200);
//                return response()->json(Json::response(['token' => $token]), 200);
            }
            return response()->json(Json::response(null, trans('passwords.user')), 400);
        }
    }

}
