<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Access\User\User;
use App\Models\UserSubscription\UserSubscription;
use App\Models\UserSubscription\InvoiceRecords;
use App\Models\Coupon\ManageCoupon;
use Auth;
use App\Jobs\StylerZoneEmails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Mail;
use Stripe;
use Stripe\Subscription;
use Stripe\Charge;
use Stripe_Error;
use App\Jobs\StylerZoneZohoModule;
use App\Models\ListingPackage\ListingPackage;
use App\Models\SmsPackage\SmsPackage;
use App\PackagesPayment;
use App\Models\UserBusiness\UserBusiness;
use App\SMSGlobalAccounts;
use App\Libs\SmsGlobal;
use App\Repositories\Backend\SubscriptionPlanType\SubscriptionPlanTypeContract;
use App\Repositories\Backend\Plans\PlansContract;
use Illuminate\Support\Facades\DB;

/**
 * Description of SubscriptionController
 *
 * @author Administrator
 */
class SubscriptionController extends Controller
{

    public function __construct(SubscriptionPlanTypeContract $subscriptionPlanTypeContract, PlansContract $planContract)
    {
        $this->plan = $planContract;
        $this->plantype = $subscriptionPlanTypeContract;
    }

    public function getPlanType($local_plan_id)
    {
        $sh_plan_id = '0';
        $obj_subscroption_plan_type = \App\Models\SubscriptionPlanType\SubscriptionPlanType::find($local_plan_id);
        if ($obj_subscroption_plan_type->plan_type == 1 && $obj_subscroption_plan_type->booking_type == 1) {
            $sh_plan_id = '1';
        } else if ($obj_subscroption_plan_type->plan_type == 1) {
            $sh_plan_id = '2';
        }
        return $sh_plan_id;
    }

    public function addsubscription(Request $request)
    {
        $card_token = $request->input('stripeToken');
        $use_promo = $request->input('usepromo');
        $plan_type = $request->input('plan_type');
        $user_type = $request->input('usertype');
        $stripeplantype = $request->input('stripeplantype');
        $stripe_plan_id = $request->input('stripe_plan_id');
        $planid = $stripe_plan_tb_id = ($request->has('selected_stripe_plan_tb_id')) ? $request->input('selected_stripe_plan_tb_id') : '';
        $stripe_plan_tb_title = ($request->has('selected_stripe_plan_tb_title')) ? $request->input('selected_stripe_plan_tb_title') : 'free';
        $stripe_plan_tb_price = ($request->has('selected_stripe_plan_tb_price')) ? $request->input('selected_stripe_plan_tb_price') : '';
        //        $stripe_plan_tb_duration = ($request->has('selected_stripe_plan_tb_duration')) ? $request->input('selected_stripe_plan_tb_duration') : '';
        $local_plan_id = $request->input('local_plan_id');
        //        $planReplacement = array("week"=> "Weekly", "month"=> "Monthly", "year"=> "Annaully");

        try {
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            if ($plan_type == '1') {

                if (!$request->has('NewCards') && empty(Auth::user()->UserActiveSubscription()->stp_customer_id) && empty(Auth::user()->UserActiveSubscription()->stp_card_token) && empty(Auth::user()->UserActiveSubscription()->stp_subscription_id)) {

                    if ($use_promo == 1 && Auth::user()->pc_user_status == 0) {
                        $customer = \Stripe\Customer::create(array(
                            "email" => Auth::User()->email, // obtained with Stripe.js
                            'card' => $card_token,
                            'plan' => $stripe_plan_id,
                            'coupon' => Auth::User()->promo_code
                        ));
                    } else {
                        $customer = \Stripe\Customer::create(array(
                            "email" => Auth::User()->email, // obtained with Stripe.js
                            'card' => $card_token,
                            'plan' => $stripe_plan_id,
                        ));
                    }
                    if (isset(Auth::user()->UserActiveSubscription()->id)) {
                        $obj_user_subscription = UserSubscription::find(Auth::user()->UserActiveSubscription()->id);
                    } else {
                        $obj_user_subscription = new UserSubscription();
                        $obj_user_subscription->user_id = Auth::user()->id;
                        $obj_user_subscription->plan_status = 1;
                    }

                    $obj_user_subscription->stp_customer_id = $customer->id;
                    $obj_user_subscription->stp_card_token = $card_token;
                    $obj_user_subscription->stp_subscription_id = $customer->subscriptions->data[0]->id;
                    $obj_user_subscription->trial_status = 2;
                    $obj_user_subscription->plan_type = $this->getPlanType($local_plan_id);
                    $obj_user_subscription->plan_id = $planid;
                    $obj_user_subscription->local_plan_id = $local_plan_id;
                    $obj_user_subscription->starting_date = date("Y-m-d H:i:s", $customer->subscriptions->data[0]->current_period_start);
                    $obj_user_subscription->ending_date = date("Y-m-d H:i:s", $customer->subscriptions->data[0]->current_period_end);

                    $obj_user_subscription->save();
                    if ($use_promo == 1) {
                        \Illuminate\Support\Facades\DB::table('users')->where('id', (int)Auth::user()->id)->update(['pc_user_status' => '1']);
                    }
                    if (Auth::User()->zoho_id) {

                        $zoho_data = array(
                            "Membership_Plan" => $stripe_plan_tb_title,
                            "Subscription_Expire" => date("Y-m-d H:i:s", $customer->subscriptions->data[0]->current_period_end),
                            "zoho_id" => Auth::User()->zoho_id
                        );
                        $this->dispatch((new StylerZoneZohoModule($zoho_data, 'update_user_subscription')));
                    }
                } else {
                    $stp_customer_id = Auth::user()->UserActiveSubscription()->stp_customer_id;
                    $stp_subscription_id_old = Auth::user()->UserActiveSubscription()->stp_subscription_id;
                    $customer = \Stripe\Customer::retrieve($stp_customer_id);
                    $obj_user_subscription = UserSubscription::find(Auth::user()->UserActiveSubscription()->id);
                    $zoho_ending_Date = '';
                    //                    print_r($customer);
                    //                    echo "1";
                    if (isset($plan_type) && $plan_type != 0) {
                        //                        echo "2";
                        if (isset($customer->subscriptions) && !empty($customer->subscriptions->data)) {
                            //                            echo "3";
                            //                            print_r($customer->subscriptions);
                            //                            echo $stripe_plan_id;
                            $subscription = \Stripe\Subscription::update($customer->subscriptions->data[0]->id, [
                                'cancel_at_period_end' => false,
                                'items' => [
                                    [
                                        'id' => $customer->subscriptions->data[0]->items->data[0]->id,
                                        'plan' => $stripe_plan_id,
                                    ],
                                ],
                            ]);
                        } else {
                            //                            echo "4";
                            $subscription = \Stripe\Subscription::create([
                                'customer' => $customer->id,
                                'items' => [['plan' => $stripe_plan_id]],
                            ]);
                        }

                        $subscription->plan = $stripe_plan_id;
                        $sub = $subscription->save();
                        $obj_user_subscription->starting_date = date("Y-m-d H:i:s", $sub->current_period_start);
                        $zoho_ending_Date = $obj_user_subscription->ending_date = date("Y-m-d H:i:s", $sub->current_period_end);
                        $obj_user_subscription->stp_subscription_id = $sub->id;
                        $obj_user_subscription->plan_id = $planid;
                    } else {
                        echo "5";
                        $customer->subscriptions->retrieve($stp_subscription_id_old)->cancel(
                            array("at_period_end" => true)
                        );
                        $obj_user_subscription->starting_date = date("Y-m-d H:i:s");
                        $zoho_ending_Date = $obj_user_subscription->ending_date = date("Y-m-d H:i:s");
                    }
                    //                    echo "6";

                    $obj_user_subscription->trial_status = 2;
                    $obj_user_subscription->plan_type = $this->getPlanType($local_plan_id);
                    $obj_user_subscription->local_plan_id = $local_plan_id;
                    $obj_user_subscription->save();
                    //                     echo "7";
                    //                     exit;
                    if (Auth::User()->zoho_id) {
                        $zoho_data = array(
                            "Membership_Plan" => $stripe_plan_tb_title,
                            "Subscription_Expire" => $zoho_ending_Date,
                            "zoho_id" => Auth::User()->zoho_id
                        );
                        $this->dispatch((new StylerZoneZohoModule($zoho_data, 'update_user_subscription')));
                    }
                }
                $email_Detail = array(
                    "plan_name" => $stripe_plan_tb_title,
                    "price" => $stripe_plan_tb_price,
                    "type" => $stripeplantype,
                    "id" => base64_encode(Auth::User()->id),
                    "useremail" => Auth::User()->email,
                );

                $this->dispatch((new StylerZoneEmails($email_Detail, 'emails.subscription.subscribe_sucessfully')));
            } else {
                if (isset(Auth::user()->UserActiveSubscription()->id)) {
                    $obj_user_subscription = UserSubscription::find(Auth::user()->UserActiveSubscription()->id);
                    $obj_user_subscription->trial_status = 2;
                    $obj_user_subscription->plan_id = 0;
                    $obj_user_subscription->plan_type = 0;
                    $obj_user_subscription->local_plan_id = $local_plan_id;
                    $obj_user_subscription->starting_date = date("Y-m-d H:i:s");
                    $obj_user_subscription->ending_date = date("Y-m-d H:i:s");
                    $obj_user_subscription->save();
                    if (!empty($obj_user_subscription->stp_subscription_id) && !empty($obj_user_subscription->stp_subscription_id)) {
                        $customer = \Stripe\Customer::retrieve($obj_user_subscription->stp_customer_id);
                        $customer->subscriptions->retrieve($obj_user_subscription->stp_subscription_id)->cancel(
                            array("at_period_end" => true)
                        );
                        $email_Detail = array(
                            "plan_name" => $stripe_plan_tb_title,
                            "price" => $stripe_plan_tb_price,
                            "type" => $stripeplantype,
                            "id" => base64_encode(Auth::User()->id),
                            "useremail" => Auth::User()->email,
                        );
                        $this->dispatch((new StylerZoneEmails($email_Detail, 'emails.subscription.subscribe_cancel')));
                    }
                } else {
                    $obj_user_subscription = new UserSubscription();
                    $obj_user_subscription->user_id = Auth::user()->id;
                    $obj_user_subscription->trial_status = 1;
                    $obj_user_subscription->plan_id = 0;
                    $obj_user_subscription->plan_type = 0;
                    $obj_user_subscription->plan_status = 1;
                    $obj_user_subscription->local_plan_id = $local_plan_id;
                    $obj_user_subscription->starting_date = date("Y-m-d H:i:s");
                    $obj_user_subscription->ending_date = date("Y-m-d H:i:s");
                    $obj_user_subscription->save();
                }
            }
            //            exit;
            $result = array("status" => "200", "msg" => "Successfully Subscribe.");
        } catch (\Stripe\Exception\CardException $e) {
            // Since it's a decline, \Stripe\Exception\CardException will be caught
            $result = array("status" => "210", "msg" => $e->getError());
        } catch (\Stripe\Exception\RateLimitException $e) {
            // Too many requests made to the API too quickly
            $result = array("status" => "210", "msg" => $e->getError());
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Invalid parameters were supplied to Stripe's API
            $result = array("status" => "210", "msg" => $e->getError());
        } catch (\Stripe\Exception\AuthenticationException $e) {
            // Authentication with Stripe's API failed
            // (maybe you changed API keys recently)
            $result = array("status" => "210", "msg" => $e->getError());
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Network communication with Stripe failed
            $result = array("status" => "210", "msg" => $e->getError());
        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Display a very generic error to the user, and maybe send
            // yourself an email
            $result = array("status" => "210", "msg" => $e->getError());
        } catch (Exception $e) {
            // Something else happened, completely unrelated to Stripe
            $result = array("status" => "210", "msg" => $e->getError());
        }

        return $result;
        exit;
    }

    public function stripesubscription(Request $request)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $event = $request->all();
        if (isset($event) && $event['type'] == "invoice.payment_failed") {
            $plan_name = array("Trendy Basic", "Glamours - Premium", "Add on booking system");
            $plan_price = array(
                "plan_E0VKE9WT1Y2WE3" => "$58.20",
                "plan_E0VKFf9gXOswGu" => "$698.40",
                "plan_E1en4B0RGC0472" => "$698.40",
                "plan_E1eoYxQNFld1yM" => "$733.60",
                "plan_E0a93bgwoQUa6k" => "$72.75",
                "plan_E1eldC6p1p9Cao" => "$612.00",
                "plan_E1emJ7wxlmrwF4" => "$$72.75",
                "plan_E1emMYpcUKiZwr" => "$612.00",
            );
            $plans = array(
                "service_provider" => array("1" => array("monthly" => "plan_E0VKE9WT1Y2WE3", "annually" => "plan_E0VKFf9gXOswGu"), "2" => array("monthly" => "plan_E1en4B0RGC0472", "annually" => "plan_E1eoYxQNFld1yM")),
                "distributor" => array("2" => array("monthly" => "plan_E0a93bgwoQUa6k", "annually" => "plan_E1eldC6p1p9Cao")),
                "school_college" => array("2" => array("monthly" => "plan_E1emJ7wxlmrwF4", "annually" => "plan_E1emMYpcUKiZwr")),
            );
            $customer = \Stripe\Customer::retrieve($event['data']['object']['customer']);
            $email = $customer->customer_email;
            $user = DB::table('users')->where('email', $email)->get();
            if ($user) {
                $email_Detail = array(
                    "id" => base64_encode($user->id),
                    "useremail" => $email,
                );
                $this->dispatch((new StylerZoneEmails($email_Detail, 'emails.subscription.subscribe_again_later')));
                //                Mail::send('emails.subscription.subscribe_again_later', $email_Detail, function ($messages) use ($email_Detail) {
                //                    $subject = "Uh-oh! We failed to process your payment.";
                //                    $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                //                    $messages->to($email_Detail['useremail'])->subject($subject);
                //                });
                DB::table()->update(["plan_id" => 0])->where('user_id', $user->id);
            }
        } elseif (isset($event) && $event['type'] == "charge.succeeded") {
            $invoice_detail = \Stripe\Invoice::retrieve($event['data']['object']['invoice']);
            $user = User::with('UserSubscription')->where("email", $event['data']['object']['receipt_email'])->get();
            $UserSubscription = UserSubscription::find($user[0]->userSubscription[0]->id);
            $UserSubscription->stripe_invoiceId = \json_encode($event);
            $UserSubscription->save();
            $user_previous_invoice_data = InvoiceRecords::where("user_id", $user[0]->id)->where("type", '1')->get();
            //            print_r(count($user_previous_invoice_data));
            //            exit;
            if (count($user_previous_invoice_data) > 0) {
                InvoiceRecords::where('id', $user_previous_invoice_data[0]->id)->update(["type" => '0']);
            }
            $data = array(
                "stripe_customer_id" => $invoice_detail['customer'],
                "type" => '1',
                "plan_title" => $invoice_detail['lines']->data[0]->plan['id'],
                "amount" => $invoice_detail['amount_paid'],
                "currency" => $invoice_detail['lines']->data[0]->plan['currency'],
                "invoiceId" => $event['data']['object']['invoice'],
                "interval" => $invoice_detail['lines']->data[0]->plan['interval'],
                "start_from" => date('Y-m-d h:i:s', $invoice_detail['lines']->data[0]->period['start']),
                "end_at" => date('Y-m-d h:i:s', $invoice_detail['lines']->data[0]->period['end']),
                "stripe_string_payment_succeeded" => serialize($invoice_detail),
                "user_id" => $user[0]->id
            );
            $data = new InvoiceRecords($data);
            $data->save();
        }
    }

    public function pricingPackages(Request $request)
    {
        $PlanInfo = \App\Models\Access\Role\Role::with('UserPlans')->with('UserPlans.planDetail')->where('packageable', 1)->get()->toArray();
        return view('frontend.subscription.pricing')->withPlaninfo($PlanInfo);
    }

    public function checkCoupon(Request $request)
    {
        try {
            if ($request->has('coupon')) {
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                $coupon_info = \Stripe\Coupon::retrieve($request->input('coupon'));
                return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Token exist"));
            }
        } catch (\Exception $e) {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Token not exist"));
        }
    }

    public function getCouponDetails(Request $request)
    {
        if ($request->has('coupon')) {
            $couponDeatil = ManageCoupon::where("coupon_id", $request->input('coupon'))->get()->toArray();
            if ($couponDeatil) {
                return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Coupon verified.", "coupon_detail" => $couponDeatil));
            } else {
                return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Invalid coupon.", "coupon_detail" => $couponDeatil));
            }
        } else {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Invalid coupon."));
        }
    }

    public function showReceipt($id)
    {
        $usersub = UserSubscription::find($id);
        if (!empty($usersub->stripe_invoiceId)) {
            $stripeInfo = json_decode($usersub->stripe_invoiceId);
            $invoiceId = $stripeInfo->data->object->invoice;
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            $invoice_info = \Stripe\Invoice::retrieve($invoiceId);
            return Redirect::to($invoice_info->hosted_invoice_url);
        }
    }

    public function buyPackage(Request $request)
    {
        try {

            $subAccount = $this->createSMSGlobalAccount();
            if ($subAccount['status'] == "200") {
                \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                $card_token = $request->input('stripeToken');
                $data = $request->all();
                if ($data['stripeplantype'] == 'listing') {
                    $package = ListingPackage::find($data['stripeplanid']);
                } else {
                    $package = SmsPackage::find($data['stripeplanid']);
                }
                if ($data['NewCards'] == 0) {
                    if (Auth::user()->UserActiveSubscription()->stp_customer_id) {
                        $customer = \Stripe\Customer::retrieve(Auth::user()->UserActiveSubscription()->stp_customer_id);
                        $customer = \Stripe\Customer::update(
                            Auth::user()->UserActiveSubscription()->stp_customer_id, // stored in your application
                            [
                                'source' => $card_token
                            ]
                        );
                    } else {
                        $customer = \Stripe\Customer::create(array(
                            "email" => Auth::User()->email, // obtained with Stripe.js
                            'card' => $card_token,
                        ));
                    }
                    Auth::user()->UserActiveSubscription()->update(['stp_customer_id' => $customer->id, 'stp_card_token' => $customer->default_source]);
                } else {
                    $customer = \Stripe\Customer::retrieve(Auth::user()->UserActiveSubscription()->stp_customer_id);
                }
                $msg = "";
                $res = \Stripe\Charge::create([
                    'amount' => $package->price * 100,
                    'currency' => 'aud',
                    'source' => $customer->default_source,
                    'description' => $msg . ' ' . Auth::User()->email,
                    'customer' => $customer->id,
                ]);
                if ($res->id) {
                    $charge_trnsfer = 2;
                    if ((isset($subAccount['account'])) && !empty($subAccount['account']['api_key']) && !empty($subAccount['account']['api_secret'])) {

                        $charge_trnsfer = 3;
                    }
                    PackagesPayment::create(['user_id' => Auth::User()->id, 'package_id' => $package->id, 'package_type' => $data['stripeplantype'], 'stp_customer_id' => $customer->id, 'receipt_url' => $res->receipt_url, 'charge_id' => $res->id, 'charge_transfer' => $charge_trnsfer]);
                    $userbusiness = UserBusiness::where('user_id', Auth::User()->id)->first();
                    if ($userbusiness) {
                        if ($data['stripeplantype'] == 'listing') {
                            $msg = "Successfully Buy " . $package->name . ".";
                            $userbusiness->update(['listing_count' => $userbusiness->listing_count + $package->limit]);
                        } else {
                            // $userbusiness->update(['sms_count' => $userbusiness->sms_count + $package->limit]);
                            //                        $this->createSMSGlobalAccount();
                            $msg = "Your request submitted successfully. SMS transfer into your account after approval.";
                            $email_Detail = array(
                                "price" => $package->price,
                                "amount" => $package->limit,
                                "recipt_url" => $res->receipt_url,
                                "useremail" => Auth::User()->email,
                                "customer_name" => Auth::User()->name,
                                "id" => base64_encode(Auth::User()->id)
                            );
                            $this->dispatch((new StylerZoneEmails($email_Detail, 'emails.subscription.customer_sms_purchase')));
                            $admin_email_Detail = array(
                                "price" => $package->price,
                                "amount" => $package->limit,
                                "recipt_url" => $res->receipt_url,
                                "useremail" => getenv('ADMIN_EMAIL'),
                                "customer_name" => Auth::User()->name,
                                "id" => base64_encode(Auth::User()->id)
                            );
                            $this->dispatch((new StylerZoneEmails($admin_email_Detail, 'emails.subscription.admin_notify_sms_purchase')));
                        }
                    }
                    $result = array("status" => "200", "msg" => $msg);
                } else
                    $result = array("status" => "210", "msg" => "Charge Failed.");
            } else {
                $result = array("status" => "210", "msg" => $subAccount['msg']);
            }
        } catch (\Stripe\Exception\CardException $e) {
            // Since it's a decline, \Stripe\Exception\CardException will be caught
            $result = array("status" => "210", "msg" => $e->getError()->message);
        } catch (\Stripe\Exception\RateLimitException $e) {
            // Too many requests made to the API too quickly
            $result = array("status" => "210", "msg" => $e->getError()->message);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Invalid parameters were supplied to Stripe's API
            $result = array("status" => "210", "msg" => $e->getError()->message);
        } catch (\Stripe\Exception\AuthenticationException $e) {
            // Authentication with Stripe's API failed
            // (maybe you changed API keys recently)
            $result = array("status" => "210", "msg" => $e->getError()->message);
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Network communication with Stripe failed
            $result = array("status" => "210", "msg" => $e->getError()->message);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Display a very generic error to the user, and maybe send
            // yourself an email
            $result = array("status" => "210", "msg" => $e->getError()->message);
        } catch (Exception $e) {
            // Something else happened, completely unrelated to Stripe
            $result = array("status" => "210", "msg" => $e->getError()->message);
        }
        return $result;
    }

    public function createSMSGlobalAccount()
    {

        $account = SMSGlobalAccounts::where('user_id', Auth::User()->id)->get();
        $return = array("status" => "200", "msg" => "", "account" => ($account->count() > 0) ? $account->first()->toArray() : []);
        $apiKey = new SmsGlobal(env('SMS_GLOBAL_KEY'), env('SMS_GLOBAL_SECRET'));
        if (count($account) == 0) {
            $userbusiness = UserBusiness::where('user_id', Auth::User()->id)->first();
            if ($userbusiness->contact_number) {
                $number = validatePhoneNumberWithCountryList($userbusiness->contact_number);
                if ($number != "") {
                    $fields = [
                        'name' => $userbusiness->business_name ? $userbusiness->business_name : Auth::User()->name,
                        'email' => $userbusiness->business_email ? $userbusiness->business_email : Auth::User()->email,
                        'password' => 'Tiger@123',
                        'mobile' => $number,
                    ];
                    $data = $apiKey->sendRequest('POST', '/v2/user/sub-account/', $fields);
                    if ($data['status'] == 'success') {
                        $account = SMSGlobalAccounts::create(['user_id' => Auth::user()->id, 'remote_account' => 1]);
                        $return = array("status" => "200", "msg" => "1234", "account" => ($account->count() > 0) ? $account->first()->toArray() : []);
                    } else {
                        //                SMSGlobalAccounts::create(['user_id' => Auth::user()->id, 'remote_account' => $data['code'], 'api_key' => $data['status'], 'msg_error' => $data['data']]);                
                        $return = array("status" => "210", "msg" => $data['data'], "account" => ($account->count() > 0) ? $account->first()->toArray() : []);
                    }
                } else {
                    $return = array("status" => "210", "msg" => "Please add a valid contact number", "account" => ($account->count() > 0) ? $account->first()->toArray() : []);
                }
            } else {
                $return = array("status" => "210", "msg" => "Please add a valid contact number", "account" => ($account->count() > 0) ? $account->first()->toArray() : []);
            }
        }
        return $return;
    }

    public function getPreviousInvoices(Request $request)
    {
        $customer_id = $request->input('id');
        //  print_r($customer_id);
        //  exit();
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $invoice_info = \Stripe\Invoice::all(['customer' => $customer_id]);
        $datainfo = [];
        foreach ($invoice_info->data as $i) {
            // Code Here
            $info['starting_date'] = date("d-m-Y", $i->lines->data[0]->period->start);
            $info['ending_date'] = date("d-m-Y", $i->lines->data[0]->period->end);
            $info['plan_id'] = $i->lines->data[0]->plan->id;
            $info['url'] = $i->hosted_invoice_url;
            array_push($datainfo, $info);
        }

        return \GuzzleHttp\json_encode(array("status" => "200", 'data' => $datainfo, 'customerid' => $customer_id, 'leng' => count($invoice_info->data)));
    }

    public function getPlansNPackages()
    {
        $PlansInfo = \App\Models\Access\Role\Role::with('UserPlans')->with('UserPlans.planDetail')->where('packageable', 1)->get()->toArray();
        $details = array();
        $interval = array("week" => "weekly", "month" => "monthly", "year" => "annually");
        foreach ($PlansInfo as $key => $PlanInfo) { // roles
            $details[$PlanInfo['name']] = array();
            if (count($PlanInfo['user_plans']) > 0) {
                foreach ($PlanInfo['user_plans'] as $index => $value) { // role plans
                    //                    print_r($value);
                    if ($value['plan_type'] == 0) {
                        $details[$PlanInfo['name']][$value['id']]['free'] = array(
                            'plan' => 'free',
                            'price' => '0',
                            'title' => 'Trendy',
                            'des' => '',
                            'originalprice' => '0',
                            'discount' => '0'
                        );
                    } else {
                        foreach ($value['plan_detail'] as $pac_index => $pac) {

                            $price = $pac['price'];
                            if ($pac['discount'] > 0) {
                                $discounted_price = ($pac['discount'] / 100) * $price;
                                $price = $price - $discounted_price;
                            }

                            $details[$PlanInfo['name']][$value['id']][$interval[$pac['duration']]] = array(
                                'id' => $pac['id'],
                                'plan' => $pac['duration'],
                                'price' => $price,
                                'title' => $pac['name'],
                                'des' => '',
                                'originalprice' => $pac['price'],
                                'discount' => $pac['discount'],
                                'plan_id' => $pac['stripe_plan_id'],
                            );
                        }
                    }
                }
            } else { }
        }
        return json_encode(array("status" => "200", "details" => $details));
        exit;
    }

    public function getPlanDetails(Request $request)
    {
        $PlanInfo = \App\Models\Access\Role\Role::with('UserPlans')->with('UserPlans.planDetail')->where('packageable', 1)->where('name', $request->input('userType'))->first()->toArray();
        return \GuzzleHttp\json_encode(array('success' => "200", "data" => $PlanInfo['user_plans']));
    }

    public function requestChangeCard(Request $request)
    {
        if ($request->has('stripeToken')) {
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            $card_token = $request->input("stripeToken");
            if (Auth::user()->UserActiveSubscription()->stp_customer_id) {
                $customer = \Stripe\Customer::retrieve(Auth::user()->UserActiveSubscription()->stp_customer_id);
                $customer = \Stripe\Customer::update(
                    Auth::user()->UserActiveSubscription()->stp_customer_id, // stored in your application
                    [
                        'source' => $card_token
                    ]
                );
            } else {
                $customer = \Stripe\Customer::create(array(
                    "email" => Auth::User()->email, // obtained with Stripe.js
                    'card' => $card_token,
                ));
            }
            Auth::user()->UserActiveSubscription()->update(['stp_customer_id' => $customer->id, 'stp_card_token' => $customer->default_source]);
            return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Card Successfully update."));
        } else {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "something went wrong please try again later."));
        }
    }

    public function posttest()
    {
        echo "Welcome to the mail testing here...<br />";
        echo "<pre>";
        $this->createSMSGlobalAccount();
        exit;
        $apiKey = new SmsGlobal(env('SMS_GLOBAL_KEY'), env('SMS_GLOBAL_SECRET'));
        $userbusiness = UserBusiness::where('user_id', Auth::User()->id)->first();
        $fields = [
            'name' => $userbusiness->business_name ? $userbusiness->business_name : Auth::User()->name,
            'email' => "cs02@test.com",
            'password' => 'Tiger@123',
            'mobile' => "515151515151515151",
        ];
        print_r($fields);
        echo "<br />";
        $data = $apiKey->sendRequest('POST', '/v2/user/sub-account/', $fields);
        print_r($data);
        print_r(json_decode($data['data']));
    }
}
