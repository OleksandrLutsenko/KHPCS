<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->increments('id');
            $table->text('title');
            $table->integer('block_id', false, 10);
            $table->integer('type', false, 10);
            $table->integer('order_number', false, 10)->nullable();
            $table->integer('child_order_number', false, 10)->nullable();
            $table->integer('parent_answer_id', false, 10)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('questions', function($table) {
            $table->foreign('block_id')->references('id')->on('blocks');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
