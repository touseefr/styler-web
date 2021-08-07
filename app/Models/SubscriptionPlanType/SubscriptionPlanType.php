<?php

namespace App\Models\SubscriptionPlanType;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\SubscriptionPlanType\Traits\Relationship\SubscriptionplantypeRelationship;


class SubscriptionPlanType extends Model
{
    use SoftDeletes,SubscriptionplantypeRelationship;    
    protected $table='subscription_plan_type';
    protected $guarded=['id'];
}
