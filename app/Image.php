<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['link', 'contract_id'];

    public function contract(){
        return $this->belongsTo(Contract::class);
    }
}
