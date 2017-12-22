<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Variable extends Model
{
    use SoftDeletes;

    protected $fillable = ['text', 'user_id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(){
        return $this->belongsTo(User::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });

        static::deleting(function ($variable) {
            $variable->update([
                $variable->text = '<span style="background-color: red">variable was deleted</span>'
            ]);
        });
    }
}