<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangesCommonQuestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('common_questions', function (Blueprint $table) {
            $table->string('information')->nullable()->after('mandatory');
            $table->string('contract_text')->nullable();
            $table->integer('order_number', false, 10)->nullable();
            $table->integer('child_order_number', false, 10)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('common_questions', function (Blueprint $table) {
            $table->dropColumn('information');
            $table->dropColumn('contract_text');
            $table->dropColumn('order_number');
            $table->dropColumn('child_order_number');
        });
    }
}
