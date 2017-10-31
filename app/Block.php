<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $fillable = ['name'];

<<<<<<< HEAD
    protected $visible = ['name', 'questions'];
=======
    protected $visible = ['id', 'name', 'questions'];
>>>>>>> origin/dev_backend_Dmitriy_H

    protected $appends = ['questions'];

    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function question()
    {
        return $this->hasMany(Question::class);
    }

<<<<<<< HEAD
    public function getQuestionsAttribute()
    {
=======
    public function getQuestionsAttribute(){
>>>>>>> origin/dev_backend_Dmitriy_H
        return $this->question;
    }
}
