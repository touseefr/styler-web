<?php

namespace App\Models\UserInfo\Traits\Relationship;

use App\Models\UserInfo\UserInfo;
use App\Models\Access\User\User;
use App\Models\Locations\Locations;

/**
 * Class UserInfoRelationship
 * @package App\Models\UserInfo\Traits\Relationship
 */
trait UserInfoRelationship {

    /** Each user has one info record
     * @return mixed
     */
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Each user has one suburb
     * @return mixed
     */
    public function userSuburb() {
        return $this->belongsTo(Locations::class, 'suburb');
    }

}
