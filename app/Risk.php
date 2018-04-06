<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Risk extends Model
{
    protected $fillable = [
        'min_range',
        'max_range',
        'description',
        'company_id',
        'survey_id'
    ];

    public function survey(){
        return $this->belongsToMany(Survey::class);
    }

    public function company(){
        return $this->belongsToMany(Company::class);
    }

    public static function riskValue()
    {

//        $answers = Answer::whereIn('id', $request->answers_id)->get();
//
//        $value = $answers->sum('risk_value');

        $value = 123456789;

        return response()->json($value, 200);
    }
}
