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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', 'Auth\RegisterController@register');
Route::post('/login', 'Auth\LoginController@login');

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('/survey', 'SurveyController@index');
    Route::get('/survey/{survey}', 'SurveyController@show');
    Route::post('/survey', 'SurveyController@store');
    Route::put('/survey/{survey}', 'SurveyController@update');
    Route::delete('/survey/{survey}', 'SurveyController@destroy');

    Route::prefix('/survey/{survey}')->group(function () {
        Route::get('/block', 'BlockController@index');
        Route::get('/block/{block}', 'BlockController@show');
        Route::post('/block', 'BlockController@store');
        Route::put('/block/{block}', 'BlockController@update');
        Route::delete('/block/{block}', 'BlockController@destroy');

        Route::prefix('block/{block}')->group(function () {
            Route::get('/question', 'QuestionController@index');
            Route::get('/question/{question}', 'QuestionController@show');
            Route::post('/question', 'QuestionController@store');
            Route::put('/question/{question}', 'QuestionController@update');
            Route::delete('/question/{question}', 'QuestionController@destroy');

            Route::prefix('question/{question}')->group(function () {
                Route::get('/answer', 'AnswerController@index');
                Route::get('/answer/{answer}', 'AnswerController@show');
                Route::post('/answer', 'AnswerController@store');
                Route::put('/answer/{answer}', 'AnswerController@update');
                Route::delete('/answer/{answer}', 'AnswerController@destroy');
            });
        });
    });


    Route::prefix('/customer/{customer}')->group(function () {
        Route::get('/survey', 'SurveyController@index');
        Route::get('/survey/{survey}', 'SurveyController@show');

        Route::prefix('/survey/{survey}')->group(function () {
            Route::get('/block', 'BlockController@index');
            Route::get('/block/{block}', 'BlockController@show');

            Route::prefix('block/{block}')->group(function () {
                Route::get('/question', 'QuestionController@index');
                Route::get('/question/{question}', 'QuestionController@show');
            });
        });
    });

    Route::get('/report', 'ReportController@index');
    Route::post('/report', 'ReportController@store');
    Route::put('/report/{report}', 'ReportController@update');
    Route::delete('/report/{report}', 'ReportController@destroy');

    Route::get('download', 'DownloadController@download');
});
