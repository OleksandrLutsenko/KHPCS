<?php

use App\Answer;
use App\Report;
use App\Risk;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['jwt.auth'])->get('/user', function (Request $request) {
    return $request->user();
});

/** For testing */
Route::post('/test', function (Request $request) {
    $report = Report::find($request->report_id);
    return Answer::additionalText($report);
});

Route::group(['middleware' => 'jwt.auth'], function() {

    Route::get('/report/{report}/contract/{contract}/review/{userFilename}', 'ContractController@review');
    Route::get('/report/{report}/download', 'DownloadController@downloadReport');
    Route::get('/report/{report}/contract/{contract}/download', 'ContractController@downloadContract');
    Route::post('/report/{report}/contract/{contract}/send-contract/{userFilename}', 'ContractController@sendContractToClient');
    Route::post('contract-research/{contractResearch}/save-image', 'ImageController@upload');
    Route::post('contract-research/{contractResearch}/image/{image}', 'ImageController@reUpload');
    Route::delete('contract/image/{image}', 'ImageController@destroy');
    Route::get('contract/{contract}/image-list', 'ContractController@usedImages');
});

Route::group(['middleware' => 'api-response'], function() {

//    Route::post('/auth/register', 'UserController@register');
    Route::post('/auth/register/{key}', 'UserController@register');


    Route::post('/auth/login', 'UserController@login');

    Route::post('user/request-reset', 'Auth\ForgotPasswordController@getResetToken');
    Route::post('user/reset-password', 'Auth\ResetPasswordController@customReset');

    Route::group(['middleware' => 'jwt.auth'], function() {

        Route::get('/logout', 'UserController@logout');

        Route::get('/user', 'UserController@getAuthUser');
        Route::post('/user/{user}', 'UserController@update');

        /** SURVEYS */
        /** show surveys list */
        Route::get('/survey', 'SurveyController@index');
        Route::get('/onlysurvey', 'SurveyController@onlySurvey');
        /** show blocks of survey */
        Route::get('/survey/{survey}', 'SurveyController@show');
        Route::get('/survey/{survey}/deleted-questions', 'SurveyController@surveyDeletedQuestions');
        /** save new survey */
        Route::post('/survey', 'SurveyController@store');
        /** update survey */
        Route::put('/survey/{survey}', 'SurveyController@update');
        /** save new block */
        Route::post('/survey/{survey}/add-block', 'SurveyController@addBlock');
        /** delete survey */
        Route::delete('/survey/{survey}', 'SurveyController@destroy');
        /** change status active/inactive */
        Route::put('/survey/{survey}/change-status', 'SurveyController@changeStatusActiveInactive');
        /** change status archive/inactive */
        Route::put('/survey/{survey}/archive-status', 'SurveyController@changeStatusArchive');
        Route::put('/survey/{survey}/order-update', 'BlockController@updateBlockOrderNumbers');

        /** RISKS */

        Route::post('add-risk', 'RiskController@store');
        Route::post('get-risks', 'RiskController@index');
        Route::post('update-risk/{risk}', 'RiskController@update');
        Route::delete('delete-risk/{risk}', 'RiskController@destroy');
        Route::post('count-value-risk', 'RiskController@countValue');

        /** BLOCKS */
        /** show block's questions */
        Route::get('/block/{block}', 'BlockController@show');
        /** update block */
        Route::put('/block/{block}', 'BlockController@update');
        /** save new question */
        Route::post('/block/{block}/add-question', 'BlockController@addQuestion');


        Route::post('/block/{block}/add-block-questions', 'BlockController@addQuestionsBlock');

        //
        Route::post('/block/{block}/add-block-questions111', 'BlockController@addQuestionsBlock111');
        //
        /** delete block */
        Route::delete('/block/{block}', 'BlockController@destroy');

        /** QUESTIONS */
        /** show question's answers */
        Route::get('/question/{question}', 'QuestionController@show');
        /** update question */
        Route::put('/question/{question}', 'QuestionController@update');
        /** save new answer */
        Route::post('/question/{question}/add-answer', 'QuestionController@addAnswer');
        /** delete question */
        Route::delete('/question/{question}', 'QuestionController@destroy');

        /** ANSWERS */
        /** show answer */
        Route::get('/answer/{answer}', 'AnswerController@show');
        /** update answer */
        Route::put('/answer/{answer}', 'AnswerController@update');
        /** delete answer */
        Route::delete('/answer/{answer}', 'AnswerController@destroy');

        /** CONTRACT BUILDER */
        /** show contracts list */
        Route::get('/contract', 'ContractController@index');

        Route::get('/onlycontract', 'ContractController@indexWithoutBody');

        Route::get('/survey/{survey}/contracts', 'ContractController@indexForSurvey');
        /** show contract */
        Route::get('/contract/{contract}', 'ContractController@show');
        /** save new contract */
        Route::post('/contract-research/{contractResearch}/contract', 'ContractController@store');
        /** update contract */
        Route::put('/contract/{contract}', 'ContractController@update');
        /** delete contract */
        Route::delete('/contract/{contract}', 'ContractController@destroy');

        Route::post('/new-contract-research', 'ContractResearchController@store');
        Route::delete('/contract-research/{contractResearch}', 'ContractResearchController@destroy');


        /** USER MANAGEMENT TAB */
        Route::get('/report', 'ReportController@index');
        Route::get('/report/{report}', 'ReportController@showCustomerAnswer');
        Route::post('/report', 'ReportController@store');
        Route::put('/report/{report}', 'ReportController@update');
        Route::delete('/report/{report}', 'ReportController@destroy');

        Route::get('/customer', 'CustomerController@index');
        Route::get('/customer/{customer}', 'CustomerController@show');
        Route::post('/customer', 'CustomerController@store');
        Route::put('/customer/{customer}', 'CustomerController@update');
        Route::delete('/customer/{customer}', 'CustomerController@destroy');

        /** Customer scenario **/
        Route::prefix('/customer/{customer}')->group(function () {
            Route::get('/survey', 'SurveyController@customerIndex');
            Route::get('/survey/{survey}', 'SurveyController@customerShow');

            Route::get('/block/{block}', 'BlockController@customerShow');
            Route::get('/question/{question}', 'QuestionController@customerShow');

            /** Make answer by customer */
            Route::post('/make-answer', 'CustomerAnswerController@store');

            /** List of survey customer answers and status */
            Route::get('/survey/{survey}/list', 'CustomerAnswerController@customerSurveyBlockAnswers');
        });

        Route::group(['middleware' => 'role-checking'], function() {
            Route::get('/variable', 'VariableController@index');
            Route::get('/variable-all', 'VariableController@indexWithTrashed');
            Route::get('/variable/{variable}', 'VariableController@show');
            Route::post('/variable', 'VariableController@store');
            Route::put('/variable/{variable}', 'VariableController@update');
            Route::delete('/variable/{variable}', 'VariableController@destroy');

            Route::get('/companies', 'CompanyController@index');
            Route::get('/company/{company}', 'CompanyController@show');
            Route::post('/company', 'CompanyController@store');
            Route::put('/company/{company}', 'CompanyController@update');
            Route::delete('/company/{company}', 'CompanyController@destroy');
        });
        Route::delete('/storage/contracts/{filenamePdf}', 'ContractController@deletePDF');

        Route::get('/company-own', 'CompanyController@showOwn');
        Route::post('/company/{company}/assign', 'CompanyController@assignSurveyAndContracts');
        Route::get('/company/{company}/index-assigns', 'CompanyController@indexAssigns');

        Route::post('/resend-invite', 'InviteController@createAndSendInvite');
        Route::post('/send-invite', 'InviteController@A');
        Route::get('/index-invite', 'InviteController@indexInvite');
        Route::delete('/invite/{invite}/delete', 'InviteController@deleteInvite');
        Route::get('/user/{user}', 'UserController@showFAs');
        Route::delete('/user/{user}/delete', 'UserController@delete');
        Route::post('/user/{user}/update-role', 'UserController@updateRole');

        Route::get('/company/{company}/customers', 'CustomerController@indexCompanySA');
        Route::put('/customers/change-fa', 'CustomerController@updateFA');
        Route::get('/company/{company}/available-surveys', 'CompanyController@getAvailableSurveys');


        /** COMMON_QUESTION */

        Route::get('get-common-questions', 'CommonQuestionController@index');
        Route::post('create-common-question', 'CommonQuestionController@store');
        Route::post('update-common-question', 'CommonQuestionController@update');
        Route::post('delete-common-question', 'CommonQuestionController@destroy');

        /** COMMON_QUESTIONS_VALUE */

        Route::post('get-common-questions-value', 'CommonQuestionValueController@index');
        Route::post('create-common-question-value', 'CommonQuestionValueController@store');
        Route::post('update-common-question-value', 'CommonQuestionValueController@update');
        Route::post('delete-common-question-value', 'CommonQuestionValueController@destroy');
    });
});


