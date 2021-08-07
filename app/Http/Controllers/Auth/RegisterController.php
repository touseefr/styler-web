<?php

namespace App\Http\Controllers\Auth;

use App\Models\Access\User\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use App\Jobs\StylerZoneEmails;
use App\Repositories\Frontend\Auth\AuthenticationContract;
//use Auth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\Authenticatable;
class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/account';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(AuthenticationContract $auth)
    {
        $this->auth = $auth;
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        try {
            $customer = [];
//            if (isset($data['package_type']) && $data['package_type'] != "free") {
//                if ($data['accounttype'] && $data['accounttype']) {
//                    /*
//                     * planid show the type of plan like 0:free,1:free plus booking,2:glamours
//                     */
//                    $planid = $data['planid'];
//                    $planid_index = $data['package_type'];
//                    $plans = array(
//                        "service_provider" => array("1" => array("monthly" => "plan_E0VKE9WT1Y2WE3", "annually" => "plan_E0VKFf9gXOswGu"), "2" => array("monthly" => "plan_E1en4B0RGC0472", "annually" => "plan_E1eoYxQNFld1yM")),
//                        "distributor" => array("2" => array("monthly" => "plan_E0a93bgwoQUa6k", "annually" => "plan_E1eldC6p1p9Cao")),
//                        "school_college" => array("2" => array("monthly" => "plan_E1emJ7wxlmrwF4", "annually" => "plan_E1emMYpcUKiZwr")),
//                    );
//                    \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
//                    if ($data['promo_code'] && !empty($data['promo_code'])) {
//                        $customer = \Stripe\Customer::create(array(
//                            "email" => $data['email'], // obtained with Stripe.js
//                            'card' => $data['sripetoken'],
//                            'plan' => $plans[$data['account_type']][$data['planid']][$planid_index],
//                            'coupon' => $data['promo_code']
//                        ));
//                    } else {
//                        $customer = \Stripe\Customer::create(array(
//                            "email" => $data['email'], // obtained with Stripe.js
//                            'card' => $data['sripetoken'],
//                            'plan' => $plans[$data['account_type']][$data['planid']][$planid_index],
//                        ));
//                    }
//
//                    $planid_index = $planid - 1;
//                    $plan_name = array("Trendy Basic", "Glamours - Premium", "Add on booking system");
//                    $plan_price = array(
//                        "plan_E0VKE9WT1Y2WE3" => "$58.20",
//                        "plan_E0VKFf9gXOswGu" => "$698.40",
//                        "plan_E1en4B0RGC0472" => "$698.40",
//                        "plan_E1eoYxQNFld1yM" => "$733.60",
//                        "plan_E0a93bgwoQUa6k" => "$72.75",
//                        "plan_E1eldC6p1p9Cao" => "$612.00",
//                        "plan_E1emJ7wxlmrwF4" => "$$72.75",
//                        "plan_E1emMYpcUKiZwr" => "$612.00",
//                    );
//                    $plans = array(
//                        "service_provider" => array("1" => array("monthly" => "plan_E0VKE9WT1Y2WE3", "annually" => "plan_E0VKFf9gXOswGu"), "2" => array("monthly" => "plan_E1en4B0RGC0472", "annually" => "plan_E1eoYxQNFld1yM")),
//                        "distributor" => array("2" => array("monthly" => "plan_E0a93bgwoQUa6k", "annually" => "plan_E1eldC6p1p9Cao")),
//                        "school_college" => array("2" => array("monthly" => "plan_E1emJ7wxlmrwF4", "annually" => "plan_E1emMYpcUKiZwr")),
//                    );
//                }
//            }
            //Use native auth login because do not need to check status when registering
            $user = $this->auth->create($data, $customer);
            if (isset($data['package_type']) && $data['package_type'] != "free" && isset($data['promo_code']) && !empty($data['promo_code'])) {
                \Illuminate\Support\Facades\DB::table('users')->where('id', (int)$user->id)->update(['pc_user_status' => '1']);
            }
            /*
             * * Send welcome email to the user
             */
            $userBusiness = $user->UserBusiness;
            $userRole = $user->roles;
            $datas = array(
                'EMAIL' => $user->email,
                'NAME' => $user->name,
                'BusinessName' => $userBusiness->business_name,
                'search_page' => url("/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address="),
                "login_link" => url("/auth/login"),
                "unsubscribe_me" => url("/deactivateMe/" . base64_encode($user->id)),
                "profile_url" => url("/profile?id=" . base64_encode($user->id))
            );


            if (in_array($userRole[0]->id, [5, 6, 7])) {
                StylerZoneEmails::dispatch($datas, 'emails.profileUrl');
            }

            return $user;
            //            return redirect()->route('frontend.dashboard');


        } catch (\Stripe\Exception\CardException $e) {
            // Since it's a decline, \Stripe\Exception\CardException will be caught
            return response()->json(array('success' => false, 'error' => $e->getError()->message), 200);
        } catch (\Stripe\Exception\RateLimitException $e) {
            // Too many requests made to the API too quickly
            return response()->json(array('success' => false, 'error' => $e->getError()->message), 200);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Invalid parameters were supplied to Stripe's API
            return response()->json(array('success' => false, 'error' => $e->getError()->message), 200);
        } catch (\Stripe\Exception\AuthenticationException $e) {
            // Authentication with Stripe's API failed
            // (maybe you changed API keys recently)
            return response()->json(array('success' => false, 'error' => $e->getError()->message), 200);
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Network communication with Stripe failed
            return response()->json(array('success' => false, 'error' => $e->getError()->message), 200);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Display a very generic error to the user, and maybe send
            // yourself an email
            return response()->json(array('success' => false, 'error' => $e->getError()->message), 200);
        } catch (Exception $e) {
            // Something else happened, completely unrelated to Stripe
            return response()->json(array('success' => false, 'error' => $e->getMessage()), 200);
        }
    }
}
