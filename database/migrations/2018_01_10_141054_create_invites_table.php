<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invites', function (Blueprint $table) {
            $table->increments('id');
            $table->string('email');
            $table->integer('company_id', false, 10)->nullable();
            $table->integer('role_id',  false, 10)->nullable();
            $table->string('key')->nullable();
            $table->integer('is_used')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('invites', function($table) {
            $table->foreign('company_id')->references('id')->on('companies');
            $table->foreign('role_id')->references('id')->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invites');
    }
}
