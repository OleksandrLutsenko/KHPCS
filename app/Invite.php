<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;

class Invite extends Model
{

    use SoftDeletes;

    protected $fillable = ['email', 'role_id', 'company_id', 'key', 'is_used'];

    static function generateInviteKey()
    {
        return $key = str_random(30);
    }

    public function sendInvite($company, $email, $role, $key, $invite)
    {
        $letter['from'] = 'knights@gmail.com';
        $letter['subject'] = 'Invite to Knightshayes for '.$company->name;
        Mail::send('invite', compact('key', 'role', 'company'),
            function ($message) use ($letter, $company, $key, $email, $role){
                    $message->from($letter['from'])
                        ->to($email)
                        ->subject($letter['subject']);
                });

        return response(['data' => $invite, 'message' => 'The email was sent'], 200);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->key = static::generateInviteKey();
        });

    }
}
