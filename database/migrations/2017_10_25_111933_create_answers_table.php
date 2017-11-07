<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('answer_text')->default('text');
            $table->integer('question_id', false, 10);
            $table->integer('next_question', false, 10)->nullable();
            $table->timestamps();
        });

        Schema::table('answers', function($table) {
            $table->foreign('question_id')->references('id')->on('questions');
            $table->foreign('next_question')->references('id')->on('questions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('answers');
    }
}
