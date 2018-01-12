<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CompanySurvey extends Model
{
    protected $fillable = ['company_id', 'survey_id', 'contract_id'];

    public function companySurveys()
    {
        return $this->belongsTo(Company::class);
    }
}
