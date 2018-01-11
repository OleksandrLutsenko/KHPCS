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

    protected $fillable = ['name', 'email', 'password', 'company_id', 'role_id', 'customers'];

    protected $hidden = ['password', 'remember_token'];

    protected $appends = ['customers'];

    const FA = 1;
    const SUPER_ADMIN = 2;
    const COMPANY_ADMIN = 3;
    /**
     * @return bool
     */

    public function getCustomersAttribute()
    {
        $customers = Customer::where('user_id', $this->id)->get();
        return $customers;
    }


    public function isAdmin(){
//        $admin = Role::where('role', 'admin')->get()->first();
        $admin = Role::find(2);
        return $this->role_id == $admin->id;
    }

    public function isCompanyAdmin(){
        $admin = Role::find(3);
        return $this->role_id == $admin->id;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function role(){
        return $this->belongsTo(Role::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company(){
        return $this->belongsTo(Company::class);
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
     * @param $token
     * @param $user
     * @return string
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

        return response('The email was sent', 200);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $invite = Invite::where('email', $table->email)
                ->where('is_used', 0)->first();
            if($invite){
                $invite->is_used = 1;
                $invite->save();
            }
        });
    }

}
