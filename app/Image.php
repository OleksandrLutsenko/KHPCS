<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['link', 'contract_id', 'contract_research_id'];

    public function contractResearch(){
        return $this->belongsTo(ContractResearch::class);
    }
}
