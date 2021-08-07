<?php

namespace App\Repositories\Backend\SubscriptionPlanType;

use App\Exceptions\GeneralException;
use App\Models\SubscriptionPlanType\SubscriptionPlanType;
use App\Repositories\Backend\SubscriptionPlanType\SubscriptionPlanTypeContract;

class EloquentPlanTypeRepository implements SubscriptionPlanTypeContract {

    public function __construct() {
        
    }

    public function fetchAll() {
        $plansData = SubscriptionPlanType::with('planDetail')->with('planBelongToRole')->orderBy('id', 'desc')->get();
        return $plansData->toArray();
    }

    public function savePlanType($Plandata) {
        if ($Plandata) {
            /*
             * save plan information
             */


            if (isset($Plandata['cbFreePack']) && $Plandata['cbFreePack'] == 'isFree') {
                $obj_plan_type = new SubscriptionPlanType();
                $obj_plan_type->name = $Plandata['txttitle'];
                $obj_plan_type->template_description = $Plandata['descData'];
                $obj_plan_type->plan_status = 1;
                $obj_plan_type->plan_type = 0;
                $obj_plan_type->booking_type = 0;
                $obj_plan_type->role_type = $Plandata['ddlRole'];
                $obj_plan_type->save();
            } else {
                $obj_plan_type = new SubscriptionPlanType();
                $obj_plan_type->name = $Plandata['txttitle'];
                $obj_plan_type->template_description = $Plandata['descData'];
                $obj_plan_type->plan_status = 1;
                $obj_plan_type->plan_type = 1;
                $obj_plan_type->bg_colour = $Plandata['txtbgcolour'];
                $obj_plan_type->top_circle_text = isset($Plandata['bestValue']) ? 1 : 0;
                $obj_plan_type->booking_type = isset($Plandata['includebooking']) ? 1 : 0;
                $obj_plan_type->role_type = $Plandata['ddlRole'];
                $obj_plan_type->save();
                /*
                 * save stripe packages
                 */
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                $plans = $Plandata['Plan'];
                $plan_sub_relation = array();
                foreach ($plans as $key => $value) {
                    $planIs = [];
                    if ($key == 'year') {
                        $planIs = ['amount' => round($value['Price'],2) * 100,
                            'currency' => 'aud',
                            'interval' => $key,
                            'product' => ['name' => $Plandata['txttitle'] . " " . $key]];
                    } else {
                        if (isset($value['Price']) && !empty($value['Price'])) {
                            $planIs = ['amount' => round($value['Price'],2) * 100,
                                'currency' => 'aud',
                                'interval' => $key,
                                'product' => ['name' => $Plandata['txttitle'] . " " . $key]];
                        }
                    }
                    if (isset($value['Price']) && !empty($value['Price'])) {
                        $objStripePlan = \Stripe\Plan::create($planIs);
                        if ($objStripePlan) {
                            $stripe_id = $objStripePlan['id'];
                            $objPlan = new \App\Models\Plans\Plans();
                            $objPlan->name = $Plandata['txttitle'];
                            $objPlan->stripe_plan_id = $stripe_id;
                            $objPlan->price = ($key == 'year') ? round($value['netPrice'],2) : round($value['Price'],2);
                            if ($key == 'year' && isset($value['Discount']) && !empty($value['Discount'])) {
                                $objPlan->discount = $value['Discount'];
                            }
                            $objPlan->currency = 'aud';
                            $objPlan->duration = $key;
                            $objPlan->save();
                        }
                        $plan_sub_relation[] = array("plan_type_id" => $obj_plan_type->id, "plan_id" => $objPlan->id);
                    }
                }
                \Illuminate\Support\Facades\DB::table('subscription_plan_relation')->insert($plan_sub_relation);
                
            }
            return true;
        }
    }

    public function updatePlanType($Plandata,$id) {
        $obj_plan_type = SubscriptionPlanType::find($id);
        $obj_plan_type->name = $Plandata['txttitle'];
        $obj_plan_type->template_description = $Plandata['descData'];
        $obj_plan_type->bg_colour = $Plandata['txtbgcolour'];
        $obj_plan_type->role_type = $Plandata['ddlRole'];
        $obj_plan_type->save();
        return true;
    }

    public function userRoles() {
        return \App\Models\Access\Role\Role::where('packageable', 1)->get()->toArray();
    }

}
