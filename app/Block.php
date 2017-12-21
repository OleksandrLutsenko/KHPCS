<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'order_number'];

    protected $visible = ['id', 'name', 'questions', 'order_number'];

    protected $appends = ['questions'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function question()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * @return mixed
     */
    public function getQuestionsAttribute(){
        $question = $this->question()
            ->whereNotNull('order_number')
            ->orderBy('order_number')->get();
        return $question;
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($block) {

            $questions = $block->question;
            foreach ($questions as $question) {
                $question->delete();
            }
        });
    }
}
