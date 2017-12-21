<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

/**
 * @property mixed body
 */
class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'body', 'survey_id'];

    protected $visible = ['id', 'surveys', 'title', 'body', 'survey_id', 'contract_research_id'];

    protected $appends = ['surveys'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    public function contractResearch(){
        return $this->belongsTo(ContractResearch::class);
    }

    /**
     * @return mixed
     */
    public function getSurveysAttribute()
    {
        return $this->survey->name;
    }

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($contract) {

            $contractResearch = $contract->contractResearch;
            $images = $contractResearch->images;
            foreach ($images as $image){
                $fileUri = $image->link;
                File::delete('../'.$fileUri);
                $image->delete();
            }
            $contractResearch->delete();
        });
    }

}
