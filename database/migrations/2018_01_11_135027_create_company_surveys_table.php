<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompanySurveysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('company_surveys', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('company_id', false, 10)->nullable();
            $table->integer('survey_id', false, 10)->nullable();
            $table->integer('contract_id', false, 10)->nullable();
            $table->timestamps();
        });

        Schema::table('company_surveys', function($table) {
            $table->foreign('company_id')->references('id')->on('companies');
            $table->foreign('survey_id')->references('id')->on('surveys');
            $table->foreign('contract_id')->references('id')->on('contracts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('company_surveys');
    }
}
