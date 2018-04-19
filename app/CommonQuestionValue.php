<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommonQuestionValue extends Model
{
    protected $fillable = [
        'value',
        'customer_id',
        'common_question_id'
    ];

    public function commonQuestion()
    {
        return $this->belongsTo(CommonQuestion::class);
    }
}
