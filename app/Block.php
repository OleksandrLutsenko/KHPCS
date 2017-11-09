<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    protected $visible = ['id', 'name', 'questions'];

    protected $appends = ['questions'];

    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function question()
    {
        return $this->hasMany(Question::class);
    }

    public function getQuestionsAttribute(){
        return $this->question;
    }
}
