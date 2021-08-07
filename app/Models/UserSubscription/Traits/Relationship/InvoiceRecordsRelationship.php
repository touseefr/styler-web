<?php

namespace App\Models\UserSubscription\Traits\Relationship;

use App\Models\UserSubscription\InvoiceRecords;
use App\Models\Access\User\User;
trait InvoiceRecordsRelationship {

    public function userDetail() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function userBusiness() {
        return $this->hasOne(\App\Businessservices::class, 'user_id', 'user_id');
    }
    
    public function userRoles(){
        return $this->hasOne(\App\Businessservices::class, 'user_id', 'user_id');
    }
}
