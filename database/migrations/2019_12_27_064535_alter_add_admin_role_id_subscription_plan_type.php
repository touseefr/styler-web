<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterAddAdminRoleIdSubscriptionPlanType extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
//        Schema::table('subscription_plan_type', function (Blueprint $table) {
//            $table->smallInteger('role_type')->after('plan_status')->default(5)->nullable()->comment("package belong to role");
//            $table->smallInteger('plan_type')->after('role_type')->default(0)->nullable()->comment("0:free,1:paid package");
//        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
//        Schema::table('subscription_plan_type', function (Blueprint $table) {
//            $table->dropColumn('role_type');
//            $table->dropColumn('plan_type');
//        });
    }

}
