<?php

namespace App\Models\Reviews\Traits\Relationship;

use App\Models\Reviews\Reviews;
use App\Models\Access\User\User;

/**
 * Class ReviewsRelationship
 * @package App\Models\Reviews\Traits\Relationship
 */
trait ReviewsRelationship {

    /** Each Reviews has From User
     * @return mixed
     */
    public function UserFrom() {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    /** Each Reviews has to User
     * @return mixed
     */
    public function UserTo() {
        return $this->belongsTo(User::class, 'to_user_id');
    }

}
