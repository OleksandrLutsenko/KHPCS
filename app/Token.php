<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Token extends Model
{
    protected $fillable = ['user_id', 'api_token'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function user(){
        return $this->belongsTo(User::class);
    }

    /**
     * @return mixed|string
     */
    public function generateToken()
    {
        $this->api_token = str_random(60);
        $this->user_id = Auth::user()->id;
        $this->save();
        return $this->api_token;
    }
}
