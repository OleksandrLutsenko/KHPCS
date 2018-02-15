<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'surname', 'classification', 'user_id', 'company_id'];

    protected $visible = ['id', 'name', 'surname', 'classification', 'user_id', 'user_name', 'reports', 'created_at', 'company_id'];

    protected $appends = ['reports', 'user_name', 'available_surveys'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function report(){
        return $this->hasMany(Report::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function customerAnswers(){
        return $this->hasMany(CustomerAnswer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function user(){
        return $this->belongsToMany(User::class);
    }

    /**
     * @return mixed
     */
    public function getReportsAttribute()
    {
        return $this->report;
    }

    public function getAvailableSurveysAttribute()
    {
        if(isset($this->company_id)) {
            $companySurveys = CompanySurvey::where('company_id', $this->company_id)->get();
            $surveysId = array_values(array_unique(array_column($companySurveys, 'survey_id')));
            $surveys = Survey::whereIn('id', $surveysId)->get();
            return $surveys;
        }
    }

    public function getUserNameAttribute()
    {
        $user = User::find($this->user_id);
        if ($user) {
            return $user->name;
        } else {
            return null;
        }
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
//            $table->user_id = Auth::user()->id;
//            $table->company_id = Auth::user()->company_id;
        });

        static::deleting(function ($customer) {
            $customerAnswers = $customer->customerAnswers;
            foreach ($customerAnswers as $customerAnswer){
                $customerAnswer->delete();
            }
            $reports = $customer->report;
            foreach ($reports as $report) {
                $report->delete();
            }
        });
    }

    /**
     * @param $query
     * @return mixed
     */
    public function scopeOwned($query){
        return $query->where('user_id', Auth::user()->id);
    }
}
