<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/storage/images/{filename}', 'ImageController@show');
Route::get('/storage/contracts/{filename}', 'ContractController@showPDF');
Route::delete('/storage/contracts/{filenamePdf}', 'ContractController@deletePDF');
