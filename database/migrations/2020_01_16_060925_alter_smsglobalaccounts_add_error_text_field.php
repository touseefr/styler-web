<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterSmsglobalaccountsAddErrorTextField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('smsglobal_accounts', function (Blueprint $table) {
            $table->text('msg_error')->nullable()->comment("Error if occur.");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         Schema::table('smsglobal_accounts', function (Blueprint $table) {
            $table->dropColumn('msg_error');            
        });
    }
}
