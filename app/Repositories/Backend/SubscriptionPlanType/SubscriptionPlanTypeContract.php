<?php
namespace App\Repositories\Backend\SubscriptionPlanType;

interface SubscriptionPlanTypeContract {
    
    
    public function fetchAll();    
    public function savePlanType($Plandata);
    public function userRoles();
    
    
}
