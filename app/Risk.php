<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Risk extends Model
{
    private static $value = 0;

    private static $questions = array();

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

    public static function riskValue($report)
    {
        $blocks = $report->survey->block;

        foreach ($blocks as $block) {
            foreach ($block->question as $question) {
                array_push(self::$questions, $question->id);
            }
        }

        $customer_answers = CustomerAnswer::where([
            'customer_id' => $report->customer_id,
            [
                'answer_id', '!=', null
            ]
        ])
            ->whereIn('question_id', self::$questions)->get();

        foreach ($customer_answers as $customer_answer) {
            self::$value = self::$value + $customer_answer->answer->risk_value;
        }

        $risks = Risk::where([
            'survey_id' => $report->survey_id,
            'company_id' => $report->customer->company_id,
        ])->get();

        $risk = $risks->where('min_range', '<', self::$value)
            ->where('max_range', '>', self::$value)
            ->first();

        if ($risk == null) {
            return 'Number of points scored is not included in any of the risks!';
        }

        if ($risk->description == null) {
            return self::$value;
        }

        return $risk->description;
    }
}
