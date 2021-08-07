<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableSubscriptionPlanRelationAddcolTopcircletextButtontext extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::table('subscription_plan_type', function (Blueprint $table) {
//            $table->string('top_circle_text')->after('plan_status')->nullable()->comment("top circle text");
//            $table->string('button_text')->after('top_circle_text')->nullable()->comment("button text");
//        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
//        Schema::table('subscription_plan_type', function (Blueprint $table) {
//            $table->dropColumn('top_circle_text');
//            $table->dropColumn('button_text');
//        });
    }
}
