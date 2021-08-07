<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSmsCountAndListingCountInUserBusiness extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_business', function($table) {
            $table->integer('sms_count')->nullable()->default(0);                        
            $table->integer('listing_count')->nullable()->default(0);                        
            $table->date('listing_expiry')->nullable();                        
        }); 
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_business', function($table) {
            $table->dropColumn('sms_count');
            $table->dropColumn('listing_count');
            $table->dropColumn('listing_expiry');
        }); 
    }
}
