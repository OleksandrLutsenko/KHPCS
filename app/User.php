<?php

namespace App;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class User extends Authenticatable implements CanResetPassword
{
    use Notifiable;

    use SoftDeletes;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

//    protected $appends = ['api_token'];

    /**
     * @return mixed|string
     */
//    public function generateToken()
//    {
//        $this->api_token = str_random(60);
//        $this->save();
//        return $this->api_token;
//    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function role(){
        return $this->belongsTo(Role::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function survey(){
        return $this->belongsToMany(Survey::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function customer(){
        return $this->belongsToMany(Customer::class);
    }


    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function variables(){
        return $this->hasMany(Variable::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tokens(){
        return $this->hasMany(Token::class);
    }

//    public function getApiTokenAttribute()
//    {
//        $tokens = Token::where('user_id', Auth::user()->id)->get()->last();
//        return $tokens->api_token;
//    }

    /**
     * @return bool
     */
    public function isAdmin(){
        return $this->role_id === 2;
    }

    /**
     * @param $token
     * @param $user
     */
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
