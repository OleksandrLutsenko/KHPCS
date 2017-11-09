<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'content'];

    public function survey(){
        return $this->belongsTo(Survey::class);
    }


}
