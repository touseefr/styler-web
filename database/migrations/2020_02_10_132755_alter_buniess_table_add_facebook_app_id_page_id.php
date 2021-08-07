<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterBuniessTableAddFacebookAppIdPageId extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('user_business', function (Blueprint $table) {
            $table->string('facebook_app_id')->nullable()->comment("facebook chat application id.");
            $table->string('facebook_page_id')->nullable()->comment("facebook chat page id.");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('user_business', function (Blueprint $table) {
            $table->dropColumn('facebook_app_id');
            $table->dropColumn('facebook_page_id');
        });
    }

}
