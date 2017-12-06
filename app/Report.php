<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes;

    protected $table = 'customer_surveys';

    protected $fillable = ['customer_id', 'survey_id'];

    protected $visible = ['id', 'customer_id', 'survey_id', 'created_at'];

    protected $appends = ['surveys'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return mixed
     */
    public function getSurveysAttribute()
    {
        return $this->question;
    }
}
