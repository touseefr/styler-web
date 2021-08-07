<?php

namespace App\Models\SubscriptionPlanType\Traits\Relationship;

use App\Models\SubscriptionPlanType\SubscriptionPlanType;

trait SubscriptionplantypeRelationship {

    public function planDetail() {
        return $this->belongsToMany(\App\Models\Plans\Plans::class, 'subscription_plan_relation', 'plan_type_id', 'plan_id');
    }

    public function planBelongToRole() {
        return $this->hasOne(\App\Models\Access\Role\Role::class, 'id', 'role_type');
    }

}
