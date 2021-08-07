<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PackagesPayment extends Model {

    protected $table = 'packages_payment';
    protected $fillable = array('user_id', 'package_id', 'package_type', 'stp_customer_id', 'receipt_url', 'charge_id', 'charge_transfer');

    public function FetchSmsGlobalAccount() {
        return $this->hasOne(SMSGlobalAccounts::class, 'user_id', 'user_id');
    }

    public function userDetails() {
        return $this->hasOne(Models\Access\User\User::class, 'id', 'user_id');
    }
    public function FetchPackages(){
        return $this->hasOne(Models\SmsPackage\SmsPackage::class, 'id', 'package_id');
    }

}
