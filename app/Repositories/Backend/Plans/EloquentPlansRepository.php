<?php

namespace App\Repositories\Backend\Plans;

use App\Exceptions\GeneralException;
use App\Models\Plans\Plans;
use App\Repositories\Backend\Plans\PlansContract;

class EloquentPlansRepository implements PlansContract {

    public function __construct() {
        
    }

    public function fetchAll(){
        $plansData= Plans::orderBy('id','desc')->get();
        return $plansData->toArray();
    }

    public function savePlan($Plandata) {                       
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $objStripePlan=\Stripe\Plan::create(['amount' => $Plandata['txtprice'],
            'currency' => $Plandata['ddlcurrency'],
            'interval' => $Plandata['ddlinterval'],
            'product' => ['name' => $Plandata['txttitle']],]);        
        if($objStripePlan){
            $stripe_id=$objStripePlan['id'];
            $objPlan= new Plans();
            $objPlan->name=$Plandata['txttitle'];
            $objPlan->stripe_plan_id=$stripe_id;
            $objPlan->desc=$Plandata['taDescription'];
            $objPlan->price=$Plandata['txtprice'];
            $objPlan->currency=$Plandata['ddlcurrency'];
            $objPlan->duration=$Plandata['ddlinterval'];
            $objPlan->duration=$Plandata['txtdiscount'];
            $objPlan->save();
            return true;
        }else{
            return false;
        }
    }

}
