<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SMSGlobalAccounts extends Model {

    protected $table = 'smsglobal_accounts';
    protected $fillable = array('user_id', 'api_key', 'api_secret', 'remote_account');

    public function userDetail() {
        return $this->hasOne(Models\Access\User\User::class, 'id', 'user_id');
    }

}
