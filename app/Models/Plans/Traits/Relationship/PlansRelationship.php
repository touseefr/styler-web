<?php

namespace App\Models\Plans\Traits\Relationship;
use App\Models\Plans\Plans;



trait PlansRelationship{
    
    
    public function planDetailRecord() {
        return $this->belongsToMany(\App\Models\SubscriptionPlanType\SubscriptionPlanType::class, 'subscription_plan_relation', 'plan_id', 'plan_type_id');
    }
    
    
}