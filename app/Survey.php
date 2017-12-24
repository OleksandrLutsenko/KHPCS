<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class Survey extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'status'];

    protected $visible = ['id', 'name', 'status', 'survey_status', 'blocks'];

    protected $appends = ['survey_status', 'blocks'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function user(){
        return $this->belongsToMany(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function customers(){
        return $this->belongsToMany(Customer::class, 'customer_surveys');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function block(){
        return $this->hasMany(Block::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function contracts(){
        return $this->hasMany(Contract::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reports(){
        return $this->hasMany(Report::class);
    }

    /**
     * @return mixed
     */
    public function getBlocksAttribute()
    {
        $block = $this->block()
            ->whereNotNull('order_number')
            ->orderBy('order_number')->get();
        return $block;
    }

    /**
     * @return mixed
     */
    public function getSurveyStatusAttribute()
    {
        return $this->getStatusLabel();
    }

    /**
     * @return mixed
     */
    public function getStatusLabel(){
        $statusValueLabelMap = static::getStatusValueLabelMap();

//        return isset($statusValueLabelMap[$this->status]) ? $statusValueLabelMap[$this->status] : null;
        return $statusValueLabelMap[$this->status];
    }

    /**
     * @return array
     */
    public static function getStatusValueLabelMap(){
        return [
            1 => 'active',
            2 => 'inactive',
            0 => 'archived'
        ];
    }

    public function trashedQuestions($survey)
    {
        $blockArray = Block::withTrashed()
            ->where('survey_id', $survey->id)->get();
        $blockArrayIDs = array_column($blockArray->toArray(), 'id');

        $deletedQuestionArray = Question::withTrashed()
            ->whereIn('block_id', $blockArrayIDs)
            ->where('deleted_at', '!=', null)
            ->get();

        $deletedQuestionArrayIDs = array_column($deletedQuestionArray->toArray(), 'id');

        return $deletedQuestionArrayIDs;
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->user_id = Auth::user()->id;
        });

        static::deleting(function ($survey) {

            $blocks = $survey->block;
            foreach ($blocks as $block) {
                $block->delete();
            }

            $contracts = $survey->contracts;
            foreach ($contracts as $contract){
                $contract->delete();
            }

            $reports = $survey->reports;
            foreach ($reports as $report) {
                $report->delete();
            }
        });
    }


}
