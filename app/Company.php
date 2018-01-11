<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    protected $appends = ['company_admin', 'financial_advisors'];

    public function getCompanyAdminAttribute(){
//        dd($this);
        $company_admin = $this->users()
            ->where('company_id', $this->id)
            ->where('role_id', User::COMPANY_ADMIN)
            ->get();
        return $company_admin;
    }

    public function getFinancialAdvisorsAttribute(){
        $financial_advisors = $this->users()
            ->where('company_id', $this->id)
            ->where('role_id', User::FA)
            ->get();
        return $financial_advisors;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
