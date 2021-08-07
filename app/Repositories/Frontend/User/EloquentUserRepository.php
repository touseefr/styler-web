<?php

namespace App\Repositories\Frontend\User;

use App\Http\Controllers\Controller;
use App\Exceptions\GeneralException;
use App\Models\Access\User\User;
use App\Jobs\StylerZoneEmails;
use App\Jobs\StylerZoneZohoModule;
use App\Models\Access\User\UserProvider;
use App\Models\SocialMediaList\SocialMediaList;
use App\Models\UserAppointments\UserAppointments;
use App\Models\UserBusiness\UserBusiness;
use App\Models\UserInfo\UserInfo;
use App\Models\Listing\Listing;
use App\Models\Packages\Packages;
use App\Models\UserPaymentInfo\UserPaymentInfo;
use App\Models\UserSocialAccounts\UserSocialAccounts;
use App\Models\UserSubscription\UserSubscription;
use App\Repositories\Backend\Role\RoleRepositoryContract;
use App\Repositories\Frontend\Listing\ListingContract;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Auth;
use Stripe;
use Stripe\Customer;
use Stripe\Subscription;
use Stripe_Error;
use App\Booking;
use App\Employee;
use QrCode;
use Config;
//use Hash;
// use \DrewM\MailChimp\MailChimp;
use zcrmsdk\crm\setup\restclient\ZCRMRestClient;
use zcrmsdk\crm\crud\ZCRMRecord;

/**
 * Class EloquentUserRepository
 * @package App\Repositories\User
 */
class EloquentUserRepository extends Controller implements UserContract {

    /**
     * @var RoleRepositoryContract
     */
    protected $role;

    /**
     * @var ListingContract
     */
    protected $listing;

    /**
     * @param RoleRepositoryContract $role
     */
    public function __construct(RoleRepositoryContract $role, ListingContract $listing) {
        $this->role = $role;
        $this->listing = $listing;
    }

    /**
     * @param $id
     * @return \Illuminate\Support\Collection|null|static
     * @throws GeneralException
     */
    public function findOrThrowException($id) {
        $user = User::find($id);
        if (!is_null($user)) {
            return $user;
        }

        throw new GeneralException('That user does not exist.');
    }

    function randomNumber($lenght) {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < $lenght; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

    /**
     * @param $data
     * @param bool $provider
     * @return static
     */
    public function create($data, $customer = array(), $provider = false) {
//        print_r($customer);
//        exit;

        $account_type = isset($data['account_type']) ? $data['account_type'] : 'individual';

        $zoho_membership_plan = 'free';
        $zoho_ending_date = date("Y-m-d", strtotime('+60 days'));
        if (isset($data['sub_newletter']) && !empty($data['sub_newletter'])) {
            // $MailChimp = new MailChimp(Config::get('mailchimp.apikey'));
            // $list_id = Config::get('mailchimp.listId');
            // $result = $MailChimp->post("lists/$list_id/members", [
            //     'email_address' => $data['email'],
            //     'status' => 'subscribed',
            // ]);            
        }
//        print_r($data);
//        print_r($data['email']);
//        echo "<br />";
//        print_r([
//            'name' => $data['name'],
//            'email' => $data['email'],
//            'password' => $provider ? null : $data['password'],
//            'confirmation_code' => md5(uniqid(mt_rand(), true)),
//            'confirmed' => config('access.users.confirm_email') ? 0 : 1,
//            'hear_us' => (isset($data['hear_us']) && !empty($data['hear_us'])) ? $data['hear_us'] : '',
//            'sub_newletter' => (isset($data['sub_newletter']) && !empty($data['sub_newletter'])) ? $data['sub_newletter'] : '0',
//            'other_option' => (isset($data['other_option']) && !empty($data['other_option'])) ? $data['other_option'] : '',
//            'promo_code' => (isset($data['promo_code']) && !empty($data['promo_code'])) ? $data['promo_code'] : '',
//        ]);
        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = $provider ? null : $data['password'];
        $user->confirmation_code = md5(uniqid(mt_rand(), true));
        $user->confirmed = config('access.users.confirm_email') ? 0 : 1;
        $user->hear_us = (isset($data['hear_us']) && !empty($data['hear_us'])) ? $data['hear_us'] : '';
        $user->sub_newletter = (isset($data['sub_newletter']) && !empty($data['sub_newletter'])) ? $data['sub_newletter'] : '0';
        $user->other_option = (isset($data['other_option']) && !empty($data['other_option'])) ? $data['other_option'] : '';
        $user->promo_code = (isset($data['promo_code']) && !empty($data['promo_code'])) ? $data['promo_code'] : '';
        $user->save();

//        $user = User::create([
//                    'name' => $data['name'],
//                    'email' => $data['email'],
//                    'password' => $provider ? null : $data['password'],
//                    'confirmation_code' => md5(uniqid(mt_rand(), true)),
//                    'confirmed' => config('access.users.confirm_email') ? 0 : 1,
//                    'hear_us' => (isset($data['hear_us']) && !empty($data['hear_us'])) ? $data['hear_us'] : '',
//                    'sub_newletter' => (isset($data['sub_newletter']) && !empty($data['sub_newletter'])) ? $data['sub_newletter'] : '0',
//                    'other_option' => (isset($data['other_option']) && !empty($data['other_option'])) ? $data['other_option'] : '',
//                    'promo_code' => (isset($data['promo_code']) && !empty($data['promo_code'])) ? $data['promo_code'] : '',
//        ]);
//        print_r($user);
//        exit;
        $contact_number = (isset($data['contact_number']) && !is_null($data['contact_number']) && $data['contact_number'] != '') ? $data['contact_number'] : 0;
        $suburb = isset($data['suburb']) && !is_null($data['suburb']) ? $data['suburb'] : null;
        $state = isset($data['state']) && !is_null($data['state']) ? $data['state'] : null;
        $postcode = isset($data['postcode']) && !is_null($data['postcode']) ? $data['postcode'] : null;
        $latitude = isset($data['latitude']) && !is_null($data['latitude']) ? $data['latitude'] : null;
        $longitude = isset($data['longitude']) && !is_null($data['longitude']) ? $data['longitude'] : null;
        $operating_hours = isset($data['operating_hours']) && !is_null($data['operating_hours']) ? $data['operating_hours'] : null;
        $dateOfbirth = isset($data['dob']) ? date("Y-m-d", strtotime($data['dob'])) : '0000-00-00';
        $userInfo = new UserInfo(
                array(
            'contact_number' => $contact_number,
            'looking_job' => $account_type === 'job_seeker' ? 'yes' : 'no',
            'suburb' => $suburb,
            'state' => $state,
            'postcode' => $postcode,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'dateOfbirth' => $dateOfbirth
                )
        );

        $user->UserInfo()->save($userInfo);
        $business_name = isset($data['business_name']) && !is_null($data['business_name']) ? $data['business_name'] : null;

        // $work_with_overseas_students = $data['work_with_overseas_students'] ? 1 : 0;
        // $government_assistance = $data['government_assistance'] ? 1 : 0;

        $userBusinessInfo = new UserBusiness(
                array(
            'business_name' => $business_name,
            'business_email' => $data['email'],
            'business_suburb' => $suburb,
            'contact_number' => $contact_number,
            'state' => $state,
            'postcode' => $postcode,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'operating_hours' => $operating_hours,
            'business_code' => $this->randomNumber(7)
                )
        );
        $user->UserBusiness()->save($userBusinessInfo);

        if ($account_type === 'individual' || $account_type === 'Individual') {
            $user->attachRole($this->role->getUserRole(config('access.users.roles.INDIVIDUAL')));
        } elseif ($account_type === 'service_provider' || $account_type === 'ServiceProvider') {
            $user->attachRole($this->role->getUserRole(config('access.users.roles.SERVICE_PROVIDER')));
            $planid = $data['planid'];
        } elseif ($account_type === 'school_college' || $account_type === 'SchoolCollege') {
            $user->attachRole($this->role->getUserRole(config('access.users.roles.SCHOOL_COLLEGE')));
        } elseif ($account_type === 'distributor' || $account_type === 'Distributor') {
            $user->attachRole($this->role->getUserRole(config('access.users.roles.DISTRIBUTOR')));
            $planid = $data['planid'];
        } elseif ($account_type === 'job_seeker' || $account_type === 'JobSeeker') {
            $user->attachRole($this->role->getUserRole(config('access.users.roles.JOB_SEEKER')));
        } else {
            $user->attachRole($this->role->getDefaultUserRole());
        }
        /*
         * user subscription info save start here
         */
        $plan_type = array("weekly" => 0, "monthly" => 1, "annually" => 2);
        $starting_date = date('Y-m-d h:i:s');
        $ending_date = date("Y-m-d h:i:s", strtotime('+60 days'));
        $package_type = array("free" => 0, "monthly" => 1, "annually" => 2, "weekly" => 3);
        $objUserSubscrip = new UserSubscription(array(
            "plan_id" => isset($data['selected_stripe_plan_tb_id']) ? $data['selected_stripe_plan_tb_id'] : 2,
            "plan_status" => "1",
            "trial_status" => "1",
            "starting_date" => $starting_date,
            "ending_date" => $ending_date,
            "plan_type" => isset($data['package_type']) ? $package_type[$data['package_type']] : 0
        ));
        $sub = $user->UserSubscription()->save($objUserSubscrip);
        /*
         * $account_fee_paid=$data['acccounttype']
         * 0: free account
         * 1: paid account
         */
        $account_free_paid = isset($data['accounttype']) ? $data['accounttype'] : 0;
        if ($account_free_paid == 1 && !empty($data['sripetoken']) && $data['package_type'] != 'free') {
            $this->create_subscription($sub->id, $data['sripetoken'], $data['selected_stripe_plan_tb_id'], $data['email'], $customer, $data);
//            $planid_index = $planid - 1;
//            $plan_name = array("Trendy Basic", "Glamours - Premium", "Add on booking system");
//            $plan_price = array(
//                "plan_E0VKE9WT1Y2WE3" => "$58.20",
//                "plan_E0VKFf9gXOswGu" => "$698.40",
//                "plan_E1en4B0RGC0472" => "$698.40",
//                "plan_E1eoYxQNFld1yM" => "$733.60",
//                "plan_E0a93bgwoQUa6k" => "$72.75",
//                "plan_E1eldC6p1p9Cao" => "$612.00",
//                "plan_E1emJ7wxlmrwF4" => "$$72.75",
//                "plan_E1emMYpcUKiZwr" => "$612.00",
//            );
            $zoho_ending_date = date("Y-m-d", $customer->subscriptions->data[0]->current_period_end);
//            $plans = array(
//                "service_provider" => array("1" => array("monthly" => "plan_E0VKE9WT1Y2WE3", "annually" => "plan_E0VKFf9gXOswGu"), "2" => array("monthly" => "plan_E1en4B0RGC0472", "annually" => "plan_E1eoYxQNFld1yM")),
//                "distributor" => array("2" => array("monthly" => "plan_E0a93bgwoQUa6k", "annually" => "plan_E1eldC6p1p9Cao")),
//                "school_college" => array("2" => array("monthly" => "plan_E1emJ7wxlmrwF4", "annually" => "plan_E1emMYpcUKiZwr"))
//            );
            $email_Detail = array(
                "plan_name" => $data['selected_stripe_plan_tb_title'],
                "price" => round($data['selected_stripe_plan_tb_price'], 2),
                "type" => $data['package_type'],
                "id" => base64_encode($user->id),
                "useremail" => $user->email
            );
            $zoho_membership_plan = $data['selected_stripe_plan_tb_title'];
            StylerZoneEmails::dispatch($email_Detail, 'emails.subscription.subscribe_sucessfully');
//            $this->dispatch((new StylerZoneEmails($email_Detail, 'emails.subscription.subscribe_sucessfully')));
//            Mail::send('emails.subscription.subscribe_sucessfully', $email_Detail, function ($messages) use ($email_Detail) {
//                $subject = "Amazing! Your Stylerzone Premier Subscription is All Set.";
//                $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//                $messages->to($email_Detail['useremail'])->subject($subject);
//            });
        }

        /*
         * user subscription info save end here
         */
        if (config('access.users.confirm_email') && $provider === false) {
            $this->sendConfirmationEmail($user);
        } else {
            $user->confirmed = 1;
        }
        $zoho_data = array(
            "Account_Name" => ($business_name) ? $business_name : $data['name'],
            "Account_Email" => $data['email'],
            "Signup_Date" => date('Y-m-d'),
            "Phone" => ($contact_number) ? $contact_number : '',
            "Newsletter" => (isset($data['sub_newletter']) && !empty($data['sub_newletter'])) ? 'Yes' : 'No',
            "Membership_Plan" => $zoho_membership_plan,
            "User_Role" => isset($data['account_type']) ? $data['account_type'] : 'individual',
            "Subscription_Expire" => $zoho_ending_date,
            "Date_Of_Birth" => (isset($data['dob']) && !empty($data['dob'])) ? date('Y-m-d', strtotime($data['dob'])) : '',
            "account_type" => $account_type,
            "user_id" => $user->id
        );
        StylerZoneZohoModule::dispatch($zoho_data, 'create_user');
        // $this->dispatch((new StylerZoneZohoModule($zoho_data, 'create_user')));
        return $user;
    }

    public function create_subscription($user_subscription_id, $card_token, $planid, $email, $customer, $data = "") {
        $planid_index = $planid - 1;

        $obj_user_subscription = UserSubscription::find($user_subscription_id);
        $obj_user_subscription->stp_customer_id = $customer->id;
        $obj_user_subscription->stp_card_token = $card_token;
        $obj_user_subscription->stp_subscription_id = $customer->subscriptions->data[0]->id;
        $obj_user_subscription->trial_status = 2;
        $obj_user_subscription->plan_id = $planid;
        $obj_user_subscription->starting_date = date("Y-m-d H:i:s", $customer->subscriptions->data[0]->current_period_start);
        $obj_user_subscription->ending_date = date("Y-m-d H:i:s", $customer->subscriptions->data[0]->current_period_end);
        $obj_user_subscription->save();
    }

    /**
     * @param $data
     * @param $provider
     * @return static
     */
    public function findByUserNameOrCreate($data, $provider) {
        $user = User::where('email', $data->email)->first();
        $providerData = [
            'avatar' => $data->avatar,
            'provider' => $provider,
            'provider_id' => $data->id,
        ];

        if (!$user) {
            $user = $this->create([
                'name' => $data->name,
                'email' => $data->email,
                    ], [], true);
        }

        if ($this->hasProvider($user, $provider)) {
            $this->checkIfUserNeedsUpdating($provider, $data, $user);
        } else {
            $user->providers()->save(new UserProvider($providerData));
        }

        return $user;
    }

    /**
     * @param $user
     * @return mixed
     */
    public function findUserFullDetail($id) {
        $user = User::with('UserInfo.userSuburb')
                ->with('roles')
                ->with('profilepic')
                ->with('profilevideo')
                ->with('UserBusiness.userBusinessSuburb')
                ->with('UserBusiness.categories')
                ->with('userPaymentInfo.packages')
                ->with('UserSocialAccounts')
                ->with(array('UserSubscription' => function($query) {
                        $query->where("plan_status", 1);
                    }))
                ->with('UserSubscription.subscription_user_plan')
                ->with('UserSubscription.subscription_user_plan.planDetailRecord')
                ->with('UserSubscription.subscription_user_plan.planDetailRecord.planBelongToRole')
                ->find($id);

        $social_media_list = SocialMediaList::all();
        $user->social_medias_list = $social_media_list;

        $userSocialMediaAccounts = $user->UserSocialAccounts;

        $userSocialMediaAccountsNew = array();
        foreach ($userSocialMediaAccounts as $userSocialMediaAccount) {
            $userSocialMediaAccountsNew[$userSocialMediaAccount->key] = $userSocialMediaAccount->value;
        }

        unset($user->userSocialMediaAccounts);
        $user->profile_url = "data:image/png;base64, " . base64_encode(QrCode::format('png')->size(150)->margin(0)->generate(url('/profile?id=' . base64_encode($user->id))));
        $user->userSocialMediaAccounts = $userSocialMediaAccountsNew;

        return $user;
    }

    /**
     * @param $user
     * @return mixed
     */
    public function getUserDetail($input) {
        $user = User::query()
                ->with('roles')
                ->with('profilepic')
                ->with('UserBusiness')
                ->with('UserBusiness.userBusinessSuburb')
                ->with('listing.assets')
                ->with('UserSocialAccounts')
                ->with('BusinessBrands')
                ->with('Employee')
                ->with('scCourses')
                ->with('Booking');
//                ->width('scCourses');

        if (isset($input['id']) && $input['id'] != '') {
            if (isset($input['page_type'])) {
                if ($input['page_type'] == 'next') {
                    $user->where('id', '>', $input['id']);
                    $user->orderBy('id', 'asc');
                } else {
                    $user->where('id', '<', $input['id']);
                    $user->orderBy('id', 'desc');
                }
            } else {
                $user->OfId($input['id']);
//                $user->orderBy('id', 'desc');
            }
        } else {
            $user->OfBusinessKeyword($input);
            $user->OfLocation($input);
            $role = isset($input['type']) ? $input['type'] : 'ServiceProvider';
            $user->OfRoles($role);
            $user->orderBy('id', 'desc');
        }

        $user = $user->paginate(1)->appends($input);
        if (isset($user[0]->UserBusiness)) {
            $user[0]->UserBusiness->operating_hours = json_decode($user[0]->UserBusiness->operating_hours);
            $user[0]->UserBusiness->business_categories = json_decode($user[0]->UserBusiness->business_categories);
        }
        if (isset($user[0]->listing)) {
            $user[0]->listing = self::_group_by($user[0]->listing, 'type');
        }

        if (isset($user[0]->UserSocialAccounts)) {

            $userSocialMediaAccounts = $user[0]->UserSocialAccounts;

            $userSocialMediaAccountsNew = array();
            foreach ($userSocialMediaAccounts as $userSocialMediaAccount) {
                $userSocialMediaAccountsNew[$userSocialMediaAccount->key] = $userSocialMediaAccount->value;
            }

            unset($user[0]->UserSocialAccounts);

            $user[0]->UserSocialAccounts = $userSocialMediaAccountsNew;
        }

        return $user;
    }

    public function _group_by($array, $key) {
        $return = array();
        foreach ($array as $val) {
            $return[$val[$key]][] = $val;
        }
        return $return;
    }

    /**
     * @param $user
     * @param $provider
     * @return bool
     */
    public function hasProvider($user, $provider) {
        foreach ($user->providers as $p) {
            if ($p->provider == $provider) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param $provider
     * @param $providerData
     * @param $user
     */
    public function checkIfUserNeedsUpdating($provider, $providerData, $user) {
        //Have to first check to see if name and email have to be updated
        $userData = [
            'email' => $providerData->email,
            'name' => $providerData->name,
        ];
        $dbData = [
            'email' => $user->email,
            'name' => $user->name,
        ];
        $differences = array_diff($userData, $dbData);
        if (!empty($differences)) {
            $user->email = $providerData->email;
            $user->name = $providerData->name;
            $user->save();
        }

        //Then have to check to see if avatar for specific provider has changed
        $p = $user->providers()->where('provider', $provider)->first();
        if ($p->avatar != $providerData->avatar) {
            $p->avatar = $providerData->avatar;
            $p->save();
        }
    }

    /**
     * @param $input
     * @return mixed
     * @throws GeneralException
     */
    public function updateProfile($input) {
        $user = access()->user();
        if (!empty($input['old_password'])) {
            if (Hash::check($input['old_password'], $user->password)) {
                
            } else {
                echo json_encode(array("status" => "210", "msg" => "Invalid Old Password."));
                exit;
            }
        }
        $user->name = $input['name'];
        $user->iagree = $input['iagree'];
        if (isset($input['password']) && trim($input['password']) != '') {
            $user->password = $input['password'];
        }
        $user->save();

        $user->job_notifications = isset($input['jobnotifications']) ? $input['jobnotifications'] : 0;

        if ($user->canChangeEmail()) {
            //Address is not current address
            if ($user->email != $input['email']) {
                //Emails have to be unique
                if (User::where('email', $input['email'])->first()) {
                    throw new GeneralException("That e-mail address is already taken.");
                }
                $user->email = $input['email'];
            }
        }
        // print_r($input['suburb']);
        $suburb = is_array($input['suburb']) ? $input['suburb']['location'] : NULL;
        $postcode = is_array($input['suburb']) ? $input['suburb']['postcode'] : NULL;
        $state = is_array($input['suburb']) ? $input['suburb']['state'] : NULL;

        $exp_salary = isset($input['exp_salary']) ? $input['exp_salary'] : null;
        $youtube_video = isset($input['youtube_video']) ? $input['youtube_video'] : '';
        //print_r($cat_ids);

        if (isset($input['contactnumber'])) {
            $contact_number = (isset($input['contactnumber']) && !is_null($input['contactnumber'])) ? $input['contactnumber'] : null;
            $about = isset($input['about']) ? $input['about'] : null;
            $data = array(
                'about' => $about,
                'suburb' => $suburb,
                'contact_number' => $contact_number,
                'youtube_video' => $youtube_video,
                'state' => $state,
                'postcode' => $postcode,
                'exp_salary' => $exp_salary
            );
        } else {
            $address = isset($input['address']) ? $input['address'] : null;
            $gender = isset($input['gender']) ? $input['gender'] : null;
            $jobposition = isset($input['jobposition']) ? $input['jobposition'] : null;
            $jobtitle = isset($input['jobtitle']) ? $input['jobtitle'] : null;
            $cat_ids = isset($input['cat']) ? $input['cat'] : [];
            $cat_name = isset($input['cat']['name']) ? $input['cat']['name'] : null;
            $jobtype = isset($input['jobtype']) ? $input['jobtype'] : null;
            $exp_salary = isset($input['exp_salary']) ? $input['exp_salary'] : null;
            $contact = isset($input['contact']) ? $input['contact'] : null;
            $all_ids = [];
            $all_name = [];
            if (!empty($cat_ids)) {
                foreach ($cat_ids as $cat_id) {
                    $all_ids[] = $cat_id['id'];
                    $all_name[] = $cat_id['name'];
                }
            }

            $cats_id = json_encode($all_ids);
            $all_name = json_encode($all_name);
            $data = array(
                'address' => $address,
                'suburb' => $suburb,
                'gender' => $gender,
                'jobposition' => json_encode($jobposition),
                'jobtitle' => $jobtitle,
                'cat_id' => $cats_id,
                'cat_name' => $all_name,
                'jobtype' => json_encode($jobtype),
                'youtube_video' => $youtube_video,
                'state' => $state,
                'postcode' => $postcode,
                'contact_number' => $contact,
                'exp_salary' => $exp_salary,
            );
        }



        if (!User::find(access()->id())->userInfo) {
            $userInfo = new UserInfo($data);
            $user->UserInfo()->save($userInfo);
        } else {
            $user->UserInfo()->update($data);
        }

        /*
         * * Send email to the user if he updated his/her profile
         */

        // $datas = array('NAME' => $user->name, 'EMAIL' => $user->email, 'PHONE' => $contact_number);

        /* 	Mail::send('emails.account_settings', $datas, function($messages) use ($datas)
          {
          $subject = getenv('ACCOUNT_SETTINGS_UPDATED');

          $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));

          $messages->to($datas['EMAIL'])->subject($subject);
          }); */
        // return $user->save();
    }

    /**
     * @param $input
     * @return mixed
     * @throws GeneralException
     */
    public function updateindividualinfo($input) {
        $user = access()->user();
        $isAustralian = $input['isAustralian'] ? 'yes' : 'no';
        $lookingwork = $input['lookingJob'] ? 'yes' : 'no';

        if (!User::find(access()->id())->userInfo) {
            $userInfo = new UserInfo(array('looking_job' => $lookingwork, 'is_australian' => $isAustralian));
            $user->UserInfo()->save($userInfo);
        } else {
            $user->UserInfo()->update(array('looking_job' => $lookingwork, 'is_australian' => $isAustralian));
        }
        $redirect = false;

        if ($input['lookingJob']) {
            $user->detachRoles($user->roles);
            $user->attachRole($this->role->getUserRole(config('access.users.roles.JOB_SEEKER')));
            $redirect = true;
        } else {
            $user->detachRoles($user->roles);
            $user->attachRole($this->role->getUserRole(config('access.users.roles.INDIVIDUAL')));
            $redirect = true;
        }
        $user->save();
        return $redirect;
    }

    public function updatesocialmedia($input) {

        $user_id = $input['user_id'];

        DB::table('user_social_accounts')
                ->where('user_id', $user_id)
                ->delete();

        DB::table('user_social_accounts')->insert($input['data']);

        return true;
    }

    /**
     * @param $input
     * @return mixed UserBusiness
     * @throws GeneralException
     */
    public function updateBusinessInfo($input) {
//        print_r($input);
//        exit;
        $user = access()->user();
        //$locations = is_array($input['locations']) && count($input['locations']) ? $input['locations'][0] : NULL;
        $locations = isset($input['locations']) ? $input['locations'] : NULL;
        $input['categories'] = json_encode($input['categories']);
        $user->iagree = isset($input['iagree']) ? $input['iagree'] : '';
        $user->save();
        // return response()->json($input);
        $data = array(
            'business_name' => $input['name'],
            'contact_number' => $input['contactnumber'],
            'business_email' => $input['email'],
            'business_suburb' => $locations,
            'latitude' => !empty($input['latitude']) ? $input['latitude'] : "",
            'longitude' => !empty($input['longitude']) ? $input['longitude'] : "",
            'state' => !empty($input['state']) ? $input['state'] : "",
            'postcode' => !empty($input['postcode']) ? $input['postcode'] : "",
            'about' => $input['about'],
            'business_address' => $input['address'],
            'operating_hours' => isset($input['operating_hours']) ? $input['operating_hours'] : '',
            'abn' => isset($input['abn']) ? $input['abn'] : '',
            'abn_name' => isset($input['abn_name']) ? $input['abn_name'] : '',
            'business_categories' => isset($input['categories']) ? stripcslashes($input['categories']) : '',
            'website' => $input['website'],
            'work_with_overseas_students' => isset($input['work_with_overseas_students']) ? $input['work_with_overseas_students'] : 0,
            'government_assistance' => isset($input['government_assistance']) ? $input['government_assistance'] : 0,
            'busi_type' => isset($input['businessType']) ? $input['businessType'] : '',
        );
        if (!User::find(access()->id())->UserBusiness) {
            $userInfo = new UserBusiness($data);
            $user->UserBusiness()->save($userInfo);
        } else {
            $data1 = '';
            $locations = isset($input['locations']) ? $input['locations'] : NULL;
            if (!empty($locations) OR ! empty(trim($input['categories']))) {
                $data1 = array('business_name' => $input['name'],
                    'contact_number' => $input['contactnumber'],
                    'business_email' => $input['email'],
                    'business_suburb' => $locations,
                    'about' => $input['about'],
                    'business_address' => $input['address'],
                    'operating_hours' => isset($input['operating_hours']) ? $input['operating_hours'] : '',
                    'abn' => isset($input['abn']) ? $input['abn'] : '',
                    'abn_name' => isset($input['abn_name']) ? $input['abn_name'] : '',
                    'business_categories' => trim($input['categories']),
                    'website' => $input['website'],
                    'work_with_overseas_students' => $input['work_with_overseas_students'] ? $input['work_with_overseas_students'] : 0,
                    'government_assistance' => $input['government_assistance'] ? $input['government_assistance'] : 0,
                    'busi_type' => isset($input['businessType']) ? $input['businessType'] : '',
                );
            } else {
                $data1 = array('business_name' => $input['name'],
                    'contact_number' => $input['contactnumber'],
                    'business_email' => $input['email'],
                    'about' => $input['about'],
                    'business_address' => $input['address'],
                    'operating_hours' => isset($input['operating_hours']) ? $input['operating_hours'] : '',
                    'abn' => isset($input['abn']) ? $input['abn'] : '',
                    'abn_name' => isset($input['abn_name']) ? $input['abn_name'] : '',
                    'website' => $input['website'],
                    'work_with_overseas_students' => $input['work_with_overseas_students'] ? $input['work_with_overseas_students'] : 0,
                    'government_assistance' => $input['government_assistance'] ? $input['government_assistance'] : 0
                );
            }
            try {
                if (!empty($input['latitude'])) {
                    $data1['latitude'] = $input['latitude'];
                }
                if (!empty($input['longitude'])) {
                    $data1['longitude'] = $input['longitude'];
                }
                if (!empty($input['state'])) {
                    $data1['state'] = $input['state'];
                }
                if (!empty($input['postcode'])) {
                    $data1['postcode'] = $input['postcode'];
                }
                $user->UserBusiness()->update($data1);
            } catch (\Exception $e) {
                die($e->getMessage());
            }
        }
        $b_id = User::find(access()->id())->UserBusiness->id;
        $user_business = UserBusiness::find($b_id);
        $categories = json_decode($input['categories'], JSON_UNESCAPED_SLASHES);
        $categories_pro = array();
        foreach ($categories as $category) {
            $categories_pro[] = array('business_id' => $b_id, 'category_id' => $category['id']);
        }
        $user_business->categories()->sync($categories_pro);
        /*
         * * Send email to the user if he updated his/her profile
         */
        if (!isset($input['noNotificationEmail'])) {
            $datas = array('NAME' => $user->name, 'EMAIL' => $user->email, 'PHONE' => $input['contactnumber']);
            StylerZoneEmails::dispatch($datas, 'emails.businessinfo');
        }
//        $this->dispatch((new StylerZoneEmails($datas, 'emails.businessinfo')));
        if ($user->zoho_id) {
            $zoho_data = array(
                "abn" => isset($input['abn']) ? $input['abn'] : '',
                "abn_name" => isset($input['abn_name']) ? $input['abn_name'] : '',
                "zoho_id" => $user->zoho_id
            );
//            print_r($zoho_data);
//            exit;
            StylerZoneZohoModule::dispatch($zoho_data, 'update_user_abn_update');
            // $this->dispatch((new StylerZoneZohoModule($zoho_data, 'update_user_abn_update')));
        }
//        Mail::send('emails.businessinfo', $datas, function ($messages) use ($datas) {
//            $subject = getenv('BUSINESS_INFO_UPDATED');
//            $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//            $messages->to($datas['EMAIL'])->subject($subject);
//        });
        return $user;
    }

    /**
     * @param $input
     * @return mixed
     * @throws GeneralException
     */
    public function changePassword($input) {
        $user = $this->findOrThrowException(auth()->id());       
        if (Hash::check($input['old_password'], $user->password)) {
            //Passwords are hashed on the model
            $user->password = $input['password'];
            $datas = array('EMAIL' => $user->email, 'NAME' => $user->name);
            StylerZoneEmails::dispatch($datas, 'emails.password_changed');                                  
            return $user->save();
        }
//        throw new GeneralException("That is not your old password.");
    }

    /**
     * @param $token
     * @throws GeneralException
     */
    public function confirmAccount($token) {
        $user = User::where('confirmation_code', $token)->first();

        if ($user) {
            if ($user->confirmed == 1) {
                throw new GeneralException("Your account is already confirmed.");
            }

            if ($user->confirmation_code == $token) {
                $user->confirmed = 1;
                return $user->save();
            }

            throw new GeneralException("Your confirmation code does not match.");
        }

        throw new GeneralException("That confirmation code does not exist.");
    }

    /**
     * @param $user
     * @return mixed
     */
    public function sendConfirmationEmail($user) {
        //$user can be user instance or id
        if (!$user instanceof User) {
            $user = User::findOrFail($user);
        }
        $data = array("data" => ['token' => $user->confirmation_code, 'id' => base64_encode($user->id), 'APP_URL' => env('APP_URL')], "user" => $user);
        StylerZoneEmails::dispatch($data, 'emails.confirm');
        // return $this->dispatch((new StylerZoneEmails($data, 'emails.confirm')));
//        return Mail::send('emails.confirm', ['token' => $user->confirmation_code, 'id' => base64_encode($user->id)], function ($message) use ($user) {
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//                    $message->to($user->email, $user->name)->subject("You’re Just a Click Away from Enjoying Stylerzone!");
//                });
    }

    /**
     * this return user preferred jobs,applied job, Shotlisted job
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function getUserJobs($id) {

        $user = User::find($id);
        return array('jobs_preferred' => $user->jobPrefrences()->with('User')->with('User.profilepic')->with('User.UserBusiness')->get()->toArray(), 'jobs_shortlisted' => $user->jobShortlist()->with('User')->with('User.profilepic')->with('User.UserBusiness')->get()->toArray(), 'jobs_applied' => $user->jobApplied()->with('User.profilepic')->with('User')->with('User.UserBusiness')->get()->toArray());
    }

    public function getRecentMembers() {
        $recent_members = User::query()
                ->with('roles')
                ->with('profilepic')
                ->with('UserBusiness')
        ;

        $roles = array('ServiceProvider', 'Distributor');

        $recent_members->OfRolesin($roles);

        $recent_members = $recent_members->orderBy('id', 'desc')->simplePaginate(3);

        return $recent_members;
    }

    /**
     * search search service provider
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function search($input, $tab) {
        $q = User::query()
                ->with('profilepic')
                ->with('UserInfo');
        $q->OfKeyword($input);
        $role = 'ServiceProvider';
        $q->OfRoles($role);
        $q->OfLocation($input);
        if ($tab != '') {
            $q = $q->paginate(3, ['*'], 'page2')->appends($input);
        } else {
            $q = $q->paginate(3)->toArray();
        }
        return $q;
    }

    /**
     * search search Job Seeker
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function searchJobSeeker($input) {
        $q = User::query()
                ->with('profilepic')
                ->with('UserInfo')
                ->with('roles');
        $q->OfKeyword($input);
        $role = 'JobSeeker';
        $q->OfRoles($role);
        return $q->get();
    }

    /**
     * search search | ServiceProvider and Distributer
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function searchUser($input) {
        $q = User::query()
                ->with('profilepic')
                ->with('UserInfo')
                ->with('roles');
        $q->OfKeyword($input);
        $roles = array('ServiceProvider', 'Distributor');
        $q->OfRolesin($roles);
        return $q->get();
    }

    /**
     * book appointments for customer
     * @param $array | $object
     * @return bool
     * @throws GeneralException
     */
    public function bookappointment($input) {
        $appointments = new UserAppointments();
        $appointments->user_id = access()->id();
        $appointments->service_provider_id = $input['touser'];
        $appointments->appointment_date = date('Y-m-d h:i:s', strtotime($input['appointmentdate']));
        $appointments->services = $input['appointmentservices'];
        $appointments->save();
        $servicesSelected = json_decode($input['appointmentservices'], true);

        $fromuser = User::findOrFail(access()->id());
        $touser = User::findOrFail($input['touser']);

        Mail::send('emails.appointmentfrom', ['appointment' => $appointments->appointment_date, 'servicesSelected' => $servicesSelected], function ($message) use ($fromuser, $touser) {
            $message->from($touser->email, app_name());
            $message->to($fromuser->email, $fromuser->name)->subject(app_name() . ': New Appointment');
        });

        return Mail::send('emails.appointmentwith', ['appointment' => $appointments->appointment_date, 'servicesSelected' => $servicesSelected], function ($message) use ($fromuser, $touser) {

                    $message->from($fromuser->email, app_name());
                    $message->to($touser->email, $touser->name)->subject(app_name() . ': New Appointment');
                });
    }

    /**
     * book appointments for customer
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function getShortlistJob($input) {
        $jobprefrence = User::where('id', '=', access()->id())->OfJobPrefrence($input['id'])->get();
        if (!count($jobprefrence)) {
            $user = User::find(access()->id());
            $user->jobPrefrences()->attach($input['id']);
            return array('status' => 1, 'message' => 'Job successfully saved to your preferred list.');
        } else {
            return array('status' => 0, 'message' => 'Job already found in your preferred list.');
        }
    }

    /**
     * book appointments for customer
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function applyJob($input) {
        $jobapplied = User::where('id', '=', access()->id())->ofjobApplied($input['id'])->get();
        if (!count($jobapplied)) {
            /*             * ********** Save data in user meta if not found ************* */
            $args = array(
                'coverletter' => $input['coverLetter'],
                'resumeid' => $input['fileId']
            );
            $user_id = Auth::User()->id;
            $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->get();

            if (empty($user_meta->toArray())) {
                DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'created_at' => date("Y-m-d H:i:s"), 'key' => 'coverletter_resume', 'value' => serialize($args)]);
            } else {
                DB::table('user_meta')
                        ->where('id', $user_meta[0]->id)
                        ->update(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'coverletter_resume', 'value' => serialize($args)]);
            }
            /*             * ********** End of data in user meta if not found *********** */
            $user = User::find(access()->id());

            $user->jobApplied()->attach($input['id']);
            $servicesProvider = User::findOrFail($input['userId']);
            $email_parameters = array(
                'coverletter' => $input['coverLetter'],
                'search_page' => getenv('APP_URL') . "/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=",
                "login_link" => getenv('APP_URL') . "/auth/login",
                "id" => base64_encode($servicesProvider->id),
                "business" => $servicesProvider,
                "user_id" => base64_encode($user->id)
            );
//            print_r($email_parameters);
            StylerZoneEmails::dispatch(array("email_parameters" => $email_parameters, "servicesProvider" => $servicesProvider, "input" => $input, "user" => $user), 'emails.applyjob');

            // $this->dispatch((new StylerZoneEmails(array("email_parameters" => $email_parameters, "servicesProvider" => $servicesProvider, "input" => $input, "user" => $user), 'emails.applyjob')));
//            Mail::send('emails.applyjob', $email_parameters, function ($message) use ($servicesProvider, $input, $user) {
//                $message->from($user->email, app_name());
//                $pathToFile = public_path() . '/assets/user/resume/' . $input['resume'];
//                $message->attach($pathToFile);
//                $message->to($servicesProvider->email, $servicesProvider->name)->subject('This Candidate Might Be Your Next Rock Star Employee!');
//            });
            $email_parameters = array(
                'coverletter' => $input['coverLetter'],
                'search_page' => getenv('APP_URL') . "/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=",
                "login_link" => getenv('APP_URL') . "/auth/login",
                "id" => base64_encode($servicesProvider->id),
                "business" => $servicesProvider,
                "user" => $user
            );
            StylerZoneEmails::dispatch(array("email_parameters" => $email_parameters, "servicesProvider" => $servicesProvider, "input" => $input, "user" => $user), 'emails.applyjob_applicant');
            // $this->dispatch((new StylerZoneEmails(array("email_parameters" => $email_parameters, "servicesProvider" => $servicesProvider, "input" => $input, "user" => $user), 'emails.applyjob')));
//            Mail::send('emails.applyjob_applicant', $email_parameters, function ($message) use ($servicesProvider, $input, $user) {
//                $message->from($user->email, app_name());
//                $pathToFile = public_path() . '/assets/user/resume/' . $input['resume'];
//                $message->attach($pathToFile);
//                $message->to($user->email, $user->name)->subject("Your application was submitted to " . $servicesProvider->name . ".");
//            });
            return array('status' => 1, 'message' => 'You have successfully applied to this job.');
        } else {
            return array('status' => 0, 'message' => 'You had already been applied to this job.');
        }
    }

    /**
     * book appointments for customer
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function addtowatchlist($input) {
        //$jobprefrence = User::where('id', '=', access()->id())->OfwatchList($input['id'])->get();

        $jobprefrence = DB::select("select * from watch_list where item_id = " . $input['id'] . " and watchtype = '" . $input['watchtype'] . "' and user_id = " . access()->id() . "");
        //print_r($data);
        /* $jobprefrence = DB::table('watch_list')
          ->where('user_id', '=', access()->id())
          ->where('item_id', '=', $input['id'])
          ->where('watchtype', '=', $input['watchtype'])
          ->get();
          print_r($jobprefrence); */

        if (!count($jobprefrence)) {
            $user = User::find(access()->id());
            //$user->userWatchlist()->attach($input['id']);
            DB::insert("insert into watch_list(item_id, user_id, watchtype,created_at) values({$input['id']}, " . access()->id() . ", '{$input['watchtype']}','" . date('Y-m-d h:i:s') . "')");
            return array('status' => 1, 'message' => 'Successfully saved to watch list.');
        } else {
            return array('status' => 0, 'message' => 'Already found in watch list.');
        }
    }

    /**
     * Save user payments
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function savepaymentsDetail($input) {
        $paymentInfo = new UserPaymentInfo();
        $paymentInfo->user_id = access()->id();
        $paymentInfo->package_id = $input['packageId'];
        $paymentInfo->payment_method = 'paypal';
        $paymentInfo->status = '1';
        $paymentInfo->save();
        return $paymentInfo;
    }

    /**
     * get package detail
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function getpackageDetail($input) {
        $paymentInfo = new Packages();
        return $paymentInfo::find($input['packageId']);
    }

    /**
     * get package detail
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function getUserWatchList($id) {

        $user = User::find($id);

        return array('watch_list' => $user->userWatchlist()->with('User')->with('assets')->get());
    }

    /**
     * Send Email To Jobseeker
     * @param Array
     * @return bool
     * @throws GeneralException
     */
    public function SendEmailToJobseeker($input) {
        $mess = $input['message'];
        Mail::send('emails.jobseekers', ['usermessage' => $mess], function ($message) use ($input) {
            $message->from($input['from_user'], app_name());
            $message->to($input['to_user'])->subject(app_name());
        });
        return $input['message'];
    }

    public function userEmailCheck($email) {
        $user = User::where('email', $email)->get();
//        print_r($user[0]);
//        print_r($user->user_info);
        if ($user->count() == 0) {
            $results = 0;
        } else {
            $results = $user[0]->id;
        }
        return $results;
    }

    public function getGalleryImages($user_id) {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        $images_info = array();

        if (!empty($user_meta) && count($user_meta) > 0) {
            $assets_ids = unserialize($user_meta[0]->value);
            $images_info = array();
            foreach ($assets_ids as $cat_id => $catimages) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();


                foreach ($catimages as $imgid => $imagtitle) {
                    $image_id = $imgid;
                    $image_title = $imagtitle['title'];
                    if (!empty($image_id)) {
                        $assets = \DB::table('assets')->where(array('id' => trim(strip_tags($image_id))))->get();


                        foreach ($assets as $asset) {
                            $images_info[] = array(
                                'id' => $asset->id,
                                'name' => $asset->name,
                                'path' => $asset->path,
                                'title' => $image_title,
                                'image_cat' => $cate_info[0]->name,
                                'cat_id' => $cate_id
                            );
                        }
                    }
                }
            }
        }
        return $images_info;
    }

    public function getProfileInfoApi($id) {
        $user_Info = array();
        $user = User::with('UserInfo.userSuburb')
                ->with('roles')
                ->with('profilepic')
                ->with('profilevideo')
                ->with('UserBusiness.userBusinessSuburb')
                ->with('UserBusiness.categories')
                ->with('spServices')
                ->with('spDeals')
                ->with('ReviewTo')
                ->with('ReviewTo.UserFrom')
                ->with('ReviewTo.UserFrom.profilepic')
                ->with('Employee')
                ->find($id);
        if ($user) {
            $user = $user->toArray();
            if ($user['sp_services']) {
                foreach ($user['sp_services'] as $key => $services) {
                    $user['sp_services'][$key]['select_status'] = 'false';
                }
            }
            if ($user['sp_deals']) {
                foreach ($user['sp_deals'] as $key => $services) {
                    $user['sp_deals'][$key]['select_status'] = 'false';
                    $list = Listing::find($user['sp_deals'][$key]['id']);
                    $user['sp_deals'][$key]['assets'] = $list->assets;
                    $user['sp_deals'][$key]['listingMeta'] = $list->listingMeta;
                    $services = array();
                    foreach ($list->listService as $deal) {
                        $services[] = $deal->service;
                    }
                    $user['sp_deals'][$key]['listService'] = $services;
                }
            }
            $user['galleryImages'] = $this->getGalleryImages($id);
        } else {
            $user = array();
        }
        return $user;
    }

    public function ApiAddtowatchlist($input) {
        $jobprefrence = DB::select("select * from watch_list where item_id = " . $input['id'] . " and watchtype = '" . $input['watchtype'] . "' and user_id = " . $input['userId'] . "");

        if (!count($jobprefrence)) {
            $user = User::find(access()->id());
            //$user->userWatchlist()->attach($input['id']);
            DB::insert("insert into watch_list(item_id, user_id, watchtype,created_at) values({$input['id']}, " . $input['userId'] . ", '{$input['watchtype']}','" . date('Y-m-d h:i:s') . "')");
            return array('status' => "200", 'message' => 'Successfully saved to watch list.');
        } else {
            return array('status' => "210", 'message' => 'Already found in watch list.');
        }
    }

    public function ApiUpdateProfile($id, $input) {
        $user = User::find($id);
        if (!empty($input['old_password'])) {
            if (Hash::check($input['old_password'], $user->password)) {
                
            } else {
                echo json_encode(array("status" => "210", "msg" => "Invalid Old Password."));
                exit;
            }
        }
        $user->name = $input['name'];
        if (isset($input['password']) && trim($input['password']) != '') {
            $user->password = $input['password'];
        }
        $user->save();

        $user->job_notifications = isset($input['jobnotifications']) ? $input['jobnotifications'] : 0;

        if ($user->canChangeEmail()) {
            //Address is not current address
            if ($user->email != $input['email']) {
                //Emails have to be unique
                if (User::where('email', $input['email'])->first()) {
                    throw new GeneralException("That e-mail address is already taken.");
                }
                $user->email = $input['email'];
            }
        }
        // print_r($input['suburb']);
        $suburb = is_array($input['suburb']) ? $input['suburb']['location'] : NULL;
        $postcode = is_array($input['suburb']) ? $input['suburb']['postcode'] : NULL;
        $state = is_array($input['suburb']) ? $input['suburb']['state'] : NULL;

        $exp_salary = isset($input['exp_salary']) ? $input['exp_salary'] : null;
        $youtube_video = isset($input['youtube_video']) ? $input['youtube_video'] : '';
        //print_r($cat_ids);

        if (isset($input['contactnumber'])) {
            $contact_number = (isset($input['contactnumber']) && !is_null($input['contactnumber'])) ? $input['contactnumber'] : null;
            $about = isset($input['about']) ? $input['about'] : null;
            $data = array(
                'about' => $about,
                'suburb' => $suburb,
                'contact_number' => $contact_number,
                'youtube_video' => $youtube_video,
                'state' => $state,
                'postcode' => $postcode,
                'exp_salary' => $exp_salary
            );
        } else {
            $address = isset($input['address']) ? $input['address'] : null;
            $gender = isset($input['gender']) ? $input['gender'] : null;
            $jobposition = isset($input['jobposition']) ? $input['jobposition'] : null;
            $jobtitle = isset($input['jobtitle']) ? $input['jobtitle'] : null;
            $cat_ids = isset($input['cat']) ? $input['cat'] : [];
            $cat_name = isset($input['cat']['name']) ? $input['cat']['name'] : null;
            $jobtype = isset($input['jobtype']) ? $input['jobtype'] : null;
            $exp_salary = isset($input['exp_salary']) ? $input['exp_salary'] : null;
            $contact = isset($input['contact']) ? $input['contact'] : null;
            $all_ids = [];
            $all_name = [];
            if (!empty($cat_ids)) {
                foreach ($cat_ids as $cat_id) {
                    $all_ids[] = $cat_id['id'];
                    $all_name[] = $cat_id['name'];
                }
            }

            $cats_id = json_encode($all_ids);
            $all_name = json_encode($all_name);

            $data = array(
                'address' => $address,
                'suburb' => $suburb,
                'gender' => $gender,
                'jobposition' => $jobposition,
                'jobtitle' => $jobtitle,
                'cat_id' => $cats_id,
                'cat_name' => $all_name,
                'jobtype' => $jobtype,
                'youtube_video' => $youtube_video,
                'state' => $state,
                'postcode' => $postcode,
                'contact_number' => $contact,
                'exp_salary' => $exp_salary
            );
        }
        if (!User::find($id)->userInfo) {
            $userInfo = new UserInfo($data);
            $user->UserInfo()->save($userInfo);
        } else {
            $user->UserInfo()->update($data);
        }
    }

}
