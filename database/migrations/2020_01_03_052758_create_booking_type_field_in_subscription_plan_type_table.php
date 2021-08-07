<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookingTypeFieldInSubscriptionPlanTypeTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
//        Schema::table('subscription_plan_type', function (Blueprint $table) {
//            $table->smallInteger('booking_type')->after('plan_type')->default(0)->nullable()->comment("0: booking not included, 1 : booking included");
//            $table->string('bg_colour')->after('booking_type')->nullable()->comment("Plan background colour");            
//        });
        Schema::table('user_subscription', function (Blueprint $table) {
            $table->Integer('local_plan_id')->nullable();            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
//        Schema::table('subscription_plan_type', function (Blueprint $table) {
//            $table->dropColumn('booking_type');
//            $table->dropColumn('bg_colour');
//        });
        Schema::table('user_subscription', function (Blueprint $table) {
            $table->dropColumn('local_plan_id');            
        });
    }

}
