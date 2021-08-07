<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Backend\Plans\PlansContract;
use App\Repositories\Backend\SubscriptionPlanType\SubscriptionPlanTypeContract;
use Illuminate\Support\Facades\DB;
use Stripe;
use Stripe\Subscription;
use Stripe_Error;

class SubscriptionController extends Controller {

    public function __construct(PlansContract $plansContract, SubscriptionPlanTypeContract $SubscriptionPlanType) {
//        parent::__construct();
        $this->plans = $plansContract;
        $this->plantype = $SubscriptionPlanType;
    }

    public function index() {
        $planData = $this->plans->fetchAll();
        return view('backend.Plans.indexall', ["Plans" => $planData]);
    }

    public function createPlan(Request $request) {
        return view('backend.Plans.createPlan');
    }

    public function savePlan(Request $request) {
        if ($request->all()) {
            if ($this->plans->savePlan($request->all())) {

                return redirect('admin/subscription/packages/all')->with('message', 'Package Succefully created.');
            } else {
                return back()->with('error', 'Something went wrong, please try again later.');
            }
        }
    }

    public function deletePlan($plan_id) {
        \App\Models\Plans\Plans::find($plan_id)->delete();
        return json_encode(array("status" => "200", "msg" => "susccesfully delete"));
    }

    public function showPlanType() {
        $planType = $this->plantype->fetchAll();
        return view('backend.Plans.indexPlanType')->withPlansType($planType);
    }

    public function createPlanType() {
        $plan_items = array(
            array("text" => "Business Profile", "type" => "cb", "inputValue" => "1"),
            array("text" => "Business Hours", "type" => "cb", "inputValue" => "1"),
            array("text" => "Gallery Upload Photos", "type" => "txt", "inputValue" => "upto 4"),
            array("text" => "Gallery Upload Videos", "type" => "cb", "inputValue" => "0"),
            array("text" => "Link to your website", "type" => "cb", "inputValue" => "1"),
            array("text" => "Social Media", "type" => "cb", "inputValue" => "1"),
            array("text" => "Meet the Team", "type" => "cb", "inputValue" => "0"),
            array("text" => "Find Staff", "type" => "cb", "inputValue" => "0"),
            array("text" => "Reviews", "type" => "cb", "inputValue" => "0"),
            array("text" => "Post Deals", "type" => "cb", "inputValue" => "0"),
            array("text" => "Post Classifieds", "type" => "cb", "inputValue" => "0"),
            array("text" => "Post Jobs", "type" => "cb", "inputValue" => "0"),
            array("text" => "Listing Business for Sale", "type" => "cb", "inputValue" => "0"),
            array("text" => "Booking App", "type" => "cb", "inputValue" => "0"),
            array("text" => "Mobile App", "type" => "txt", "inputValue" => "Coming Soon"),
            array("text" => "Email Marketing", "type" => "txt", "inputValue" => "Coming Soon"),
            array("text" => "Promotional Banners", "type" => "txt", "inputValue" => "Coming Soon"),
            array("text" => "Auction", "type" => "txt", "inputValue" => "Coming Soon"),
        );
        $userRoles = $this->plantype->userRoles();
        $Plans = $this->plans->fetchAll();
        return view('backend.Plans.createPlanType')->withRoles($userRoles)->withPlans($Plans)->withItems($plan_items);
    }

    public function savePlanType(Request $request) {
        if ($request->all()) {
            if ($this->plantype->savePlanType($request->all())) {
                return \GuzzleHttp\json_encode(array("status" => "200"));
            } else {
                return \GuzzleHttp\json_encode(array("status" => "210"));
            }
        }
    }

    public function editPlanType($id) {
        $userRoles = $this->plantype->userRoles();
        $plan_type = \App\Models\SubscriptionPlanType\SubscriptionPlanType::with('planDetail')->where('id', $id)->first()->toArray();
        $stripe_plan_array = array();
        if (isset($plan_type['plan_detail']) && count($plan_type['plan_detail']) > 0) {
            foreach ($plan_type['plan_detail'] as $key => $value) {
                $stripe_plan_array[$value['duration']] = $value;
            }
            $plan_type['plan_detail'] = $stripe_plan_array;
        }
        return view('backend.Plans.editPlanType')->withRoles($userRoles)->withPlans($plan_type)->withId($id);
    }

    public function updatePlanType(Request $request, $id) {       
        if ($id) {
            if ($this->plantype->updatePlanType($request->all(),$id)) {
                return \GuzzleHttp\json_encode(array("status" => "200"));
            } else {
                return \GuzzleHttp\json_encode(array("status" => "210"));
            }
        }else{
            return \GuzzleHttp\json_encode(array("status" => "210"));
        }
        exit;
    }

    public function deletePlanType($plan_id) {
        \App\Models\SubscriptionPlanType\SubscriptionPlanType::find($plan_id)->delete();
        return json_encode(array("status" => "200", "msg" => "susccesfully delete"));
    }

}
