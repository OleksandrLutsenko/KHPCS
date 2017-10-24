<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'user_surveys';

    protected $fillable = ['user_id', 'survey_id'];
}
