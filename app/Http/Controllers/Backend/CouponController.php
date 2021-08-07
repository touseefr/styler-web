<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Coupon\ManageCoupon;
use Stripe;
use Stripe_Coupon;
use Illuminate\Support\Facades\Redirect;

class CouponController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {           
        $coupons = array();
        $coupon_type = array("Percentage", "Amount");
        $coupon_duration = array("forever", "once", "repeating");
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
//        echo "<pre>";
//        $number_of_stripe=Stripe_Coupon::all();
//        print_r($number_of_stripe);
//        exit;
        $coupons = ManageCoupon::all();
        return view('backend.coupon.index', ['coupon_type' => $coupon_type, 'duration' => $coupon_duration])->withCoupons($coupons);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {       
        return view('backend.coupon.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $coupon_data = $request->all();
        $coupon_duration = array("forever", "once", "repeating");
        try {
            if ($request->all()) {
                $number_of_days = 0;
                if ($request->has('number_of_days') && $request->input('number_of_days') > 0) {
                    $number_of_days = $request->input('number_of_days');
                } else {
                    return redirect('admin/coupon')->with(array('type' => 'alert-error', 'message' => 'Invalid Number of Days.'));
                }
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                if ($coupon_data['coupon_type'] == 0) {
                    if ($request->has('coupon_duration') && $request->input('coupon_duration') == 2) {
                        $data_sent = [
                            "percent_off" => $coupon_data['coupon_amount'],
                            "duration" => $coupon_duration[0],
                            "name" => $coupon_data['coupon_title'],
                            "metadata" => ["description" => $coupon_data['coupon_description']],
                            "redeem_by" => strtotime("+" . $request->input('number_of_days') . " day"),
                        ];
                        $stripe_coupon_data = \Stripe\Coupon::create($data_sent);
                    } else {
                        $stripe_coupon_data = \Stripe\Coupon::create([
                                    "percent_off" => $coupon_data['coupon_amount'],
                                    "duration" => $coupon_duration[$coupon_data['coupon_duration']],
                                    "name" => $coupon_data['coupon_title'],
                                    "metadata" => ["description" => $coupon_data['coupon_description']],
                        ]);
                    }
                } else {
                    $stripe_coupon_data = \Stripe\Coupon::create([
                                "amount_off" => $coupon_data['coupon_amount'],
                                "duration" => $coupon_duration[$coupon_data['coupon_duration']],
                                "name" => $coupon_data['coupon_title'],
                                "metadata" => ["description" => $coupon_data['coupon_description']]
                    ]);
                }
                $obj_coupon = new ManageCoupon();
                $obj_coupon->coupon_id = $stripe_coupon_data['id'];
                $obj_coupon->coupon_name = $coupon_data['coupon_title'];
                $obj_coupon->coupon_amount = $coupon_data['coupon_amount'];
                $obj_coupon->coupon_type = $coupon_data['coupon_type'];
                $obj_coupon->coupon_status = 0;
                $obj_coupon->coupon_description = $coupon_data['coupon_description'];
                $obj_coupon->coupon_duration = $coupon_data['coupon_duration'];
                $obj_coupon->numberOfDays = $number_of_days;
                $obj_coupon->save();
            }
            return redirect('admin/coupon')->with(array('type' => 'alert-success', 'message' => 'Coupon generate Successfully.'));
        } catch (Exception $e) {
            return redirect('admin/coupon')->with(array('type' => 'alert-danger', 'message' => 'Something went wrong.Please try later!'));
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($coupon_id) {
        if ($coupon_id) {
            $coupon = ManageCoupon::find($coupon_id)->toArray();
            return view('backend.coupon.create')->withCoupon($coupon);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        //
    }

}
