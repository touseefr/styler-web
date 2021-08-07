<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterRoleAddFlagPackagesUsers extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('roles', function (Blueprint $table) {
            $table->smallInteger('packageable')->after('sort')->default(0)->nullable()->comment("0:not packageable,1:packagesable");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('packageable');
        });
    }

}
