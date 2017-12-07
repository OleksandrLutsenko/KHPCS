<?php

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

Route::middleware(['auth:api'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('/report/{report}/contract/{contract}/review', 'ContractController@review');
    Route::get('/report/{report}/download', 'DownloadController@downloadReport');
    Route::get('/report/{report}/contract/{contract}/download', 'ContractController@downloadContract');
    Route::post('contract-research/{contractResearch}/save-image', 'ImageController@upload');
    Route::post('contract-research/{contractResearch}/image/{image}', 'ImageController@reUpload');
    Route::delete('contract/image/{image}', 'ImageController@destroy');
});

Route::group(['middleware' => 'api-response'], function() {
    Route::post('/register', 'Auth\RegisterController@register');
    Route::post('/login', 'Auth\LoginController@login');

    Route::post('user/request-reset', 'Auth\ForgotPasswordController@getResetToken');
    Route::post('user/reset-password', 'Auth\ResetPasswordController@reset');

    Route::group(['middleware' => 'auth:api'], function() {

        /** SURVEYS */
        /** show surveys list */
        Route::get('/survey', 'SurveyController@index');
        Route::get('/onlysurvey', 'SurveyController@onlySurvey');
        /** show blocks of survey */
        Route::get('/survey/{survey}', 'SurveyController@show');
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

        /** BLOCKS */
        /** show block's questions */
        Route::get('/block/{block}', 'BlockController@show');
        /** update block */
        Route::put('/block/{block}', 'BlockController@update');
        /** save new question */
        Route::post('/block/{block}/add-question', 'BlockController@addQuestion');
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
        /** show contract */
        Route::get('/contract/{contract}', 'ContractController@show');
        /** save new contract */
        Route::post('/contract-research/{contractResearch}/contract', 'ContractController@store');
        /** update contract */
        Route::put('/contract/{contract}', 'ContractController@update');
        /** save image */
//        Route::post('/contract/{contract}/save-image', 'ContractController@saveImage');
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
            Route::post('question/{question}/make-answer', 'CustomerAnswerController@store');

            /** List of survey customer answers and status */
//            Route::get('/survey/{survey}/list', 'CustomerAnswerController@customerSurveyAnswers');
            Route::get('/survey/{survey}/list', 'CustomerAnswerController@customerSurveyBlockAnswers');
        });
        Route::get('/variable', 'VariableController@index');
        Route::get('/variable/{variable}', 'VariableController@show');
        Route::post('/variable', 'VariableController@store');
        Route::put('/variable/{variable}', 'VariableController@update');
        Route::delete('/variable/{variable}', 'VariableController@destroy');
    });
});
