<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

/**
 * @property mixed body
 */
class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'body', 'survey_id'];

    protected $visible = ['id', 'surveys', 'title', 'body', 'survey_id'];

    protected $appends = ['surveys'];

    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function getSurveysAttribute()
    {
        return $this->survey->name;
    }

}
