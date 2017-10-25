<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_answers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('value');
            $table->integer('customer_id', false, 10);
            $table->integer('answer_id', false, 10);
            $table->integer('question_id', false, 10);
            $table->timestamps();
        });

        Schema::table('user_answers', function($table) {
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('answer_id')->references('id')->on('answers');
            $table->foreign('question_id')->references('id')->on('questions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_answers');
    }
}
