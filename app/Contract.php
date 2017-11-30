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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function images(){
        return $this->hasMany(Image::class);
    }

    /**
     * @return mixed
     */
    public function getSurveysAttribute()
    {
        return $this->survey->name;
    }

}
