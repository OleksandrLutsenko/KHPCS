<?php

namespace App\Providers;

use App\Answer;
use App\Block;
use App\Contract;
use App\Customer;
use App\CustomerAnswer;
use App\Policies\AnswerPolicy;
use App\Policies\BlockPolicy;
use App\Policies\ContractPolicy;
use App\Policies\CustomerAnswerPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\QuestionPolicy;
use App\Policies\ReportPolicy;
use App\Policies\SurveyPolicy;
use App\Question;
use App\Report;
use App\Survey;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Report::class => ReportPolicy::class,
        Answer::class => AnswerPolicy::class,
        Block::class => BlockPolicy::class,
        Customer::class => CustomerPolicy::class,
        CustomerAnswer::class => CustomerAnswerPolicy::class,
        Question::class => QuestionPolicy::class,
        Survey::class => SurveyPolicy::class,
        Contract::class => ContractPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
