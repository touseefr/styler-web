<?php

namespace App\Http\Controllers\Frontend\Auth;

use App\Exceptions\GeneralException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Access\LoginRequest;
use App\Http\Requests\Frontend\Access\RegisterRequest;
use App\Repositories\Frontend\Auth\AuthenticationContract;
//use App\User;
use App\Jobs\StylerZoneEmails;
use Auth;
use DB;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Mail;
use Stripe;
use Stripe_Error;

/**
 * Class AuthController
 * @package App\Http\Controllers\Frontend\Auth
 */ class AuthController extends Controller {

    use ThrottlesLogins;

    //    public $mailchimp;
    public $listId = '415a357858';
    protected $maxLoginAttempts = 3;
    protected $lockoutTime = 30;

    /**
     * @param AuthenticationContract $auth
     */
    //    public function __construct(AuthenticationContract $auth, \Mailchimp $mailchimp) {
    public function __construct(AuthenticationContract $auth) {
        $this->auth = $auth;
        //        $this->mailchimp = $mailchimp;
    }

    public function index() {
        dd($this->auth);
    }

    public function subscribe_email($email, $fname, $lname) {

        //        try {
        //            $this->mailchimp
        //                    ->lists
        //                    ->subscribe(
        //                            $this->listId, ['email' => $email], ['FNAME' => $fname, 'LNAME' => $lname], "html", // email type
        //                            false, // double optin
        //                            false, // update existing
        //                            false, // replace interests
        //                            false//send welcome
        //            );
        //        } catch (\Mailchimp_List_AlreadySubscribed $e) {
        //            echo $e->getMessage();
        //        } catch (\Mailchimp_Error $e) {
        //
        //            echo $e->getMessage();
        //        }
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getRegister(Request $request, $plan_id = 1) {
        if ($request->has('id') && $request->input('id') == 2 || ($request->has('type') && $request->input('type') == 'individual')) {
            $show_register = 2;
        } else {
            $show_register = 1;
        }
        return view('frontend.auth.register')->withplanid($plan_id)->withshowregister($show_register);
    }

    /**
     * @param RegisterRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postRegister(RegisterRequest $request) {


        $customer = [];
        if ($request->has('plan_type') && $request->input('plan_type') == "1") {
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            if ($request->has('promo_code') && !empty($request->input('promo_code'))) {
                $customer = \Stripe\Customer::create(array(
                            "email" => $request->input('email'), // obtained with Stripe.js
                            'card' => $request->input('sripetoken'),
                            'plan' => $request->input('stripe_plan_id'),
                            'coupon' => $request->input('promo_code')
                ));
            } else {
                $customer = \Stripe\Customer::create(array(
                            "email" => $request->input('email'), // obtained with Stripe.js
                            'card' => $request->input('sripetoken'),
                            'plan' => $request->input('stripe_plan_id'),
                ));
            }
        }
        //Use native auth login because do not need to check status when registering
        Auth::login($this->auth->create($request->all(), $customer));
        if ($request->has('plan_type') && $request->input('plan_type') != "0" && $request->has('promo_code') && !empty($request->input('promo_code'))) {
            \Illuminate\Support\Facades\DB::table('users')->where('id', (int) Auth::user()->id)->update(['pc_user_status' => '1']);
        }
        /*
         * * Send welcome email to the user
         */
        $userBusiness = auth()->user()->UserBusiness;
        $userRole = auth()->user()->roles;
        $datas = array(
            'EMAIL' => auth()->user()->email,
            'NAME' => auth()->user()->name,
            'BusinessName' => $userBusiness->business_name,
            'search_page' => url("/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address="),
            "login_link" => url("/auth/login"),
            "unsubscribe_me" => url("/deactivateMe/" . base64_encode(Auth::user()->id)),
            "profile_url" => url("/profile?id=" . base64_encode(Auth::user()->id))
        );
        if (in_array($userRole[0]->id, [5, 6, 7])) {
            StylerZoneEmails::dispatch($datas, 'emails.profileUrl');
        }

        if ($request->ajax()) {
            return response()->json(array('success' => true, 'data' => array()), 200);
        }
        if ($request->wantsJson()) {
            return response()->json(array('success' => true, 'data' => array()), 200);
        }
        return redirect()->route('frontend.dashboard');
    }

    /**
     * @param LoginRequest $request
     * @return \Illuminate\View\View
     */
    public function getLogin(Request $request) {
        $loginretries = !empty($_REQUEST['loginretries']) ? $_REQUEST['loginretries'] : 1;
        return view('frontend.auth.login')
                        ->withSocialiteLinks($this->getSocialLinks())
                        ->withLoginretries($loginretries);
    }

    /**
     * @param LoginRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postLogin(LoginRequest $request) {
        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        $throttles = $this->isUsingThrottlesLoginsTrait();

        $loginretries = intval($request->input('loginretries'));

        //        if ($throttles && $this->hasTooManyLoginAttempts($request)) {
        //            return redirect('password/email'); // redirect to forgot password screen if user attempt fourth time wrong login.
        //            //return $this->sendLockoutResponse($request);
        //        }
        //Don't know why the exception handler is not catching this
        try {

            $code = $request->input('g-recaptcha-response');

            if (empty($code) && $loginretries > 2) {

                if ($request->ajax()) {
                    return response()->json(array('success' => false, 'error' => "Please enter valid captcha code"), 401);
                }
                return redirect()->back()->withInput()
                                ->withLoginretries($loginretries)
                                ->withFlashDanger("Please validate captcha.");
            } else {
                if ($request->has('previous_url') && !empty($request->input('previous_url'))) {
                    session()->put('previous_url',$request->input('previous_url'));
                }
                $this->auth->login($request);
                //                if ($throttles) {
                //                    $this->clearLoginAttempts($request);
                //                }
                if ($request->ajax()) {
                    return response()->json(array('success' => true, 'data' => auth()->user()), 200);
                }

                $user_id = auth()->user()->id;

                DB::table('users')
                        ->where('id', $user_id)
                        ->update(['is_first_time' => 0]);
                $redirection_to = auth()->user()->is_first_time;
                if (isset(Auth::user()->UserActiveSubscription()->trial_status) && Auth::user()->UserActiveSubscription()->trial_status == 1 && Auth::user()->UserActiveSubscription()->plan_id == 2) {
                    $ending_date = Auth::user()->UserActiveSubscription()->ending_date;
                    $now = time(); // or your date as well
                    $your_date = strtotime($ending_date);
                    $datediff = $now - $your_date;
                    $days_left = $datediff / (60 * 60 * 24) * (-1);
                    if ($days_left <= 0) {
                        if (access()->hasRole('Distributor') || access()->hasRole('SchoolCollege') || access()->hasRole('ServiceProvider')) {
                            DB::table('user_subscription')->where('id', Auth::user()->UserActiveSubscription()->id)->update(['plan_id' => 0]);
                        }
                    }
                }
                // if($redirection_to==1){
                //     return redirect('/account#/business_info/basic-info');
                // }else{
                // }else{

                $location = '';
                if (Auth::user()->roles[0]->name == 'ServiceProvider' || Auth::user()->roles[0]->name == 'Distributor' || Auth::user()->roles[0]->name == 'SchoolCollege') {
                    $location = Auth::user()->UserBusiness->business_suburb . ',' . Auth::user()->UserBusiness->state . ',' . Auth::user()->UserBusiness->postcode;
                } else {
                    $location = Auth::user()->userInfo->suburb . ',' . Auth::user()->userInfo->state . ',' . Auth::user()->userInfo->postcode;
                }
                if (Auth::user()->roles[0]->name == 'ServiceProvider') {
                    if ($request->has('previous_url') && !empty($request->input('previous_url'))) {
                        session()->forget('previous_url');
                        return redirect('/account' . $request->input('previous_url'));
                    } else {
                        return redirect('/account');
                    }                  
                }
                return redirect('/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=' . $location);
                                
            }
        } catch (GeneralException $e) {
            // If the login attempt was unsuccessful we will increment the number of attempts
            // to login and redirect the user back to the login form. Of course, when this
            // user surpasses their maximum number of attempts they will get locked out.

            if ($request->ajax()) {
                return response()->json(array('success' => false, 'error' => $e->getMessage()), 401);
            }

            if ($loginretries >= 3) {
                return redirect('password/email');
            }

            $loginretries = $loginretries + 1;

            return redirect()->back()->withInput()
                            ->with(['loginretries' => $loginretries])
                            ->withFlashDanger($e->getMessage());
        }
    }

    /**
     * @param Request $request
     * @param $provider
     * @return mixed
     */
    public function loginThirdParty(Request $request, $provider) {

        return $this->auth->loginThirdParty($request->all(), $provider);
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function getLogout() {
        DB::table("sessions")->where("user_id", Auth::user()->id)->delete();
        //        $this->auth->logout();
        $_SERVER['HTTP_REFERER'] = './auth/login';
        return redirect(\URL::previous());
        //return redirect()->route('home');
    }

    /**
     * @param $token
     * @return mixed
     * @throws \App\Exceptions\GeneralException
     */
    public function confirmAccount($token) {
        $data = DB::select("select * from users where confirmation_code = '{$token}'");
        $name = explode(' ', $data[0]->name);

        //Don't know why the exception handler is not catching this
        try {
            $dbUser = DB::table('users')
                    ->where('confirmation_code', $token) // find your user by their email
                    ->limit(1) // optional - to ensure only one record is updated.
                    ->update(array('confirmed' => 1));
            //$this->auth->confirmAccount($token);
            //DB::select("update users set confirmed = 1 where confirmation_code = '{$token}'");
            $datas = array(
                'EMAIL' => $data[0]->email,
                'NAME' => $data[0]->name,
                'search_page' => url("/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address="),
                "login_link" => url("/auth/login"),
                "unsubscribe_me" => url("/deactivateMe/" . base64_encode($data[0]->id)),
            );

            //            Mail::send('emails.welcome', $datas, function ($message) use ($datas) {
            //                $subject = getenv('WELCOME_EMAIL_SUBJECT') . " " . $datas['NAME'];
            //
            //                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            //
            //                $message->to($datas['EMAIL'])->subject($subject);
            //            });


            /*
             * * subscribe
             */
            if (!empty($name[0]) && !empty($name[1])) {
                $this->subscribe_email($data[0]->email, $name[0], $name[1]);
            } else {
                $this->subscribe_email($data[0]->email, @$name[0], '');
            }
            // Session::put('type', 'success');
            // Session::put('message', 'Your account has been successfully confirmed!');
            return redirect('account');
//            redirect()->intended('account');
            //return redirect()->route('auth.login')->withFlashSuccess("Your account has been successfully confirmed!");
        } catch (GeneralException $e) {
            return redirect()->back()->withInput()->withFlashDanger($e->getMessage());
        }
    }

    /**
     * @param $user_id
     * @return mixed
     */
    public function resendConfirmationEmail($user_id) {
        //Don't know why the exception handler is not catching this
        try {
            $this->auth->resendConfirmationEmail($user_id);
            return redirect()->route('home')->withFlashSuccess("A new confirmation e-mail has been sent to the address on file.");
        } catch (GeneralException $e) {
            return redirect()->back()->withInput()->withFlashDanger($e->getMessage());
        }
    }

    /**
     * Helper methods to get laravel's ThrottleLogin class to work with this package
     */

    /**
     * Get the path to the login route.
     *
     * @return string
     */
    public function loginPath() {
        return property_exists($this, 'loginPath') ? $this->loginPath : '/auth/login';
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function loginUsername() {
        return property_exists($this, 'username') ? $this->username : 'email';
    }

    /**
     * Determine if the class is using the ThrottlesLogins trait.
     *
     * @return bool
     */
    protected function isUsingThrottlesLoginsTrait() {
        return in_array(
                ThrottlesLogins::class, class_uses_recursive(get_class($this))
        );
    }

    /**
     * Generates social login links based on what is enabled
     * @return string
     */
    protected function getSocialLinks() {
        $socialite_enable = [];
        $socialite_links = '';
        if (getenv('GITHUB_CLIENT_ID') != '') {
            $socialite_enable[] = link_to_route('auth.provider', trans('labels.login_with', ['social_media' => 'Github']), 'github');
        }

        if (getenv('FACEBOOK_CLIENT_ID') != '') {

            $socialite_enable[] = link_to_route('auth.provider', trans('labels.login_with', ['social_media' => 'Facebook']), 'facebook');
        }

        if (getenv('TWITTER_CLIENT_ID') != '') {
            $socialite_enable[] = link_to_route('auth.provider', trans('labels.login_with', ['social_media' => 'Twitter']), 'twitter');
        }

        if (getenv('GOOGLE_CLIENT_ID') != '') {
            $socialite_enable[] = link_to_route('auth.provider', trans('labels.login_with', ['social_media' => 'Google']), 'google');
        }

        for ($i = 0; $i < count($socialite_enable); $i++) {
            $socialite_links .= ($socialite_links != '' ? '&nbsp;|&nbsp;' : '') . $socialite_enable[$i];
        }

        return $socialite_links;
    }

    public function checkauth() {
        //        print_r(Auth::user());
        //        exit;
        if (Auth::check()) {
            $name = Auth::user()->name;
            $sname = explode(" ", $name);
            $role = Auth::user()->roles()->first()->name;
            $return = array(Auth::user()->id, Auth::user(), (isset($sname[0])) ? $sname[0] : '', (isset($sname[1])) ? $sname[1] : '', $role);
            return \GuzzleHttp\json_encode($return);
        } else {
            return \GuzzleHttp\json_encode(array("!210"));
        }
    }

    function test() {
        echo "i am here";
    }

}
