<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

//    protected $appends = ['company_admin', 'financial_advisors'];

    public function getCompanyAdminAttribute(){
        $company_admin = $this->users()->latest()
            ->where('company_id', $this->id)
            ->where('role_id', User::COMPANY_ADMIN)
            ->get();
        return $company_admin;
    }

    public function getFinancialAdvisorsAttribute(){
        $financial_advisors = $this->users()->latest()
            ->where('company_id', $this->id)
            ->where('role_id', User::FA)
            ->get();
        return $financial_advisors;
    }

    public function getCompanyAdminInvitesAttribute(){
        $company_admin_invites = Invite::latest()->where('company_id', $this->id)
            ->where('role_id', User::COMPANY_ADMIN)
            ->get();
        return $company_admin_invites;
    }

    public function getFinancialAdvisorsInvitesAttribute(){
        $financial_advisors_invites = Invite::latest()->where('company_id', $this->id)
            ->where('role_id', User::FA)
            ->get();
        return $financial_advisors_invites;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function companySurveys()
    {
        return $this->hasMany(CompanySurvey::class);
    }

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($table) {
            $users = $table->users;
            $companySurveys = $table->companySurveys;
            $customers = Customer::where('company_id', $table->id)->get();
            $invites = Invite::where('company_id', $table->id)->get();
            foreach ($users as $user) {
                $user->delete();
            }
            foreach ($companySurveys as $companySurvey) {
                $companySurvey->delete();
            }
            foreach ($customers as $customer) {
                $customer->delete();
            }
            foreach ($invites as $invite) {
                $invite->delete();
            }
        });
    }
}
