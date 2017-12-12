<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomerSurveysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_surveys', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('customer_id', false, 10);
            $table->integer('survey_id', false, 10);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('customer_surveys', function($table) {
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('survey_id')->references('id')->on('surveys');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
