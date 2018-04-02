<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommonQuestionValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('common_question_values', function (Blueprint $table) {
            $table->increments('id');
            $table->string('value');
            $table->integer('customer_id', false, 10)->nullable();
            $table->integer('common_question_id', false, 10)->nullable();

            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('common_question_id')->references('id')->on('common_questions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('common_question_values');
    }
}
