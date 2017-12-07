<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractResearch extends Model
{
    use SoftDeletes;

    public function images(){
        return $this->hasMany(Image::class);
    }

    public function contract(){
        return $this->hasOne(Contract::class);
    }
}
