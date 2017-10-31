<?php

namespace App;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Mail;

class User extends Authenticatable implements CanResetPassword
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function generateToken()
    {
        $this->api_token = str_random(60);
        $this->save();
        return $this->api_token;
    }

    public function role(){
        return $this->belongsTo(Role::class);
    }

    public function survey(){
        return $this->belongsToMany(Survey::class);
    }

    public function isAdmin(){
        return $this->role_id === 2;
    }

    public function sendLinkToReset($token, $user)
    {
        $letter['from'] = 'knights@gmail.com';
        $letter['subject'] = 'Reset the password';
        Mail::send('forgot', compact('token'), function ($message) use ($letter, $user, $token){
            $message->from($letter['from'])
                ->to($user->email)
                ->subject($letter['subject']);
        });
    }
}
