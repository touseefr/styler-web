<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use JWTFactory;
use JWTAuth;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Frontend\Auth\AuthenticationContract;
use Illuminate\Support\Facades\Mail;
use App\Repositories\Frontend\User\UserContract;
use App\Booking;
use App\Businessservices;
use App\BookingServices;
use App\Review;
use App\Models\Listing\Listing;
use App\Models\Assets\Assets;
use App\Models\UserSocialAccounts\UserSocialAccounts;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use App\Models\Customers\Customers;

class AuthController extends Controller
{

    public function __construct(AuthenticationContract $auth, UserContract $user, ReviewsContract $reviews)
    {
        $this->auth = $auth;
        $this->user = $user;
        $this->reviews = $reviews;
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }
        $credentials = $request->only('email', 'password');
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials', 'status' => '401', 'msg' => "Invalid Credential."]);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token', 'status' => '500', 'msg' => "Error in creating token please try later."]);
        }

        $userdata = array_merge(auth()->user()->toArray(), auth()->user()->userInfo->toArray());
        $userdata['profile_pic'] = auth()->user()->profilepic ? auth()->user()->profilepic->toArray() : null;
        return response()->json(['token' => compact('token')['token'], 'status' => '200', 'msg' => "Login Successfull.", "userData" => $userdata]);
    }

    public function LoginViaFacebook(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('data')) {
            $user = $this->user->findByUserNameOrCreate((object)$request->input('data'), 'facebook');
            try {
                if (!$token = JWTAuth::fromUser($user)) {
                    return response()->json(['error' => 'invalid_credentials', 'status' => '401', 'msg' => "Invalid Credential."]);
                }
            } catch (JWTException $e) {
                return response()->json(['error' => 'could_not_create_token', 'status' => '500', 'msg' => "Error in creating token please try later."]);
            }
            $userdata = array_merge($user->toArray(), $user->userInfo->toArray());
            $userdata['profile_pic'] = $user->profilepic ? $user->profilepic->toArray() : null;
            return response()->json(['token' => compact('token')['token'], 'status' => '200', 'msg' => "Login Successfull.", "userData" => $userdata]);
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function LoginViaApple(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('data')) {
            $user = $this->user->findByUserNameOrCreate((object)$request->input('data'), 'apple');
            try {
                if (!$token = JWTAuth::fromUser($user)) {
                    return response()->json(['error' => 'invalid_credentials', 'status' => '401', 'msg' => "Invalid Credential."]);
                }
            } catch (JWTException $e) {
                return response()->json(['error' => 'could_not_create_token', 'status' => '500', 'msg' => "Error in creating token please try later."]);
            }
            $userdata = array_merge($user->toArray(), $user->userInfo->toArray());
            $userdata['profile_pic'] = $user->profilepic ? $user->profilepic->toArray() : null;
            return response()->json(['token' => compact('token')['token'], 'status' => '200', 'msg' => "Login Successfull.", "userData" => $userdata]);
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function usersReturn()
    {
        return auth()->user();
    }

    public function RegisterIndividual(Request $request)
    {

        $customer = [];
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            $message = $validator->messages()->toArray();
            return response()->json(['status' => '210', 'msg' => $message['email'][0]]);
        } else {
            $user = \Illuminate\Support\Facades\DB::table('users')->where('email', $request->input('email'))->first();
            if (!$user) {
                $user = $this->auth->create($request->all(), $customer);
                $token = JWTAuth::fromUser($user);
                $datas = array(
                    'EMAIL' => $user->email,
                    'NAME' => $user->name,
                    'search_page' => getenv('APP_URL') . "/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=",
                    "login_link" => getenv('APP_URL') . "/auth/login",
                    "unsubscribe_me" => getenv('APP_URL') . "/deactivateMe/" . base64_encode($user->id),
                );
                Mail::send('emails.welcome', $datas, function ($message) use ($datas) {
                    $subject = getenv('WELCOME_EMAIL_SUBJECT') . " " . $datas['NAME'];
                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                    $message->to($datas['EMAIL'])->subject($subject);
                });
                $userrecord = \DB::table('users')->join('user_info', 'users.id', '=', 'user_info.user_id')->where('users.id', $user->id)->get();
                $userdata = $userrecord[0];
                return response()->json(['token' => $token, 'status' => '200', 'msg' => "Successfully create an account.Please verify your account.", "userData" => $userdata], 200);
            } else {
                return response()->json(['status' => '210', 'msg' => "Email Already exists"], 200);
            }
        }
    }

    public function fetchUserInfo(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('id')) {
            $userInfo = $this->user->getProfileInfoApi($request->get('id'));
            $userInfo['socialAccounts'] = UserSocialAccounts::where('user_id', $request->get('id'))->get()->toArray();
            $results = array("status" => "200", "user" => $userInfo, "msg" => "Fetch Successfully");
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function BookingInfo(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('id')) {
            $userInfo = $this->getUserInfo($request->input('id'));
            $results = array("status" => "200", "user" => $userInfo->toArray(), "msg" => "Fetch Successfully");
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function getUserInfo($user_id)
    {
        // $user = $this->user->getUserDetail(array("id" => $user_id));
        $user = \App\Models\Access\User\User::with('UserBusiness')->with('Employee')->where("id", $user_id)->get();
        // print_r($user);
        // exit;
        // $user[0]['gallery'] = $this->getmygallery($user_id);
        // $video_gallery = $this->getvideogallery($user_id);
        // $user[0]['video_gallery'] = $video_gallery;
        // $Businessservices = Businessservices::where('author', $user_id)
        //     ->where('active', '1')
        //     ->where('service_online', '1')
        //     ->get()->toArray();
        // $user[0]['business_services'] = $Businessservices;
        // $popular_services = collect($Businessservices);
        // $reviews = Review::reviewWithreply($user_id);
        // $user[0]['reviewWithreply'] = $reviews;
        // $user[0]['popularServices'] = $popular_services->where("popular_service", 1);
        // $user[0]['business_services'] = $popular_services->where("popular_service", 0);
        $Employees = array();
        if (isset($user[0]->Employee[0]) && $user[0]->Employee[0]) {
            foreach ($user[0]->Employee as $key => $info) {
                $info->employee_schedule = \GuzzleHttp\json_decode($info->employee_schedule);
                $newArray = array_merge($info->toArray(), array("bookinghours" => $info->EmployeeBookingHours->toArray()));
                $newArray = array_merge($newArray, array("blockTime" => $info->EmployeeBlockTime->toArray()));
                unset($newArray['password']);
                $Employees[] = $newArray;
            }
        }

        //        print_r($user);
        //        echo "---------------------------------------------------------------------------------------------";
        //        print_r($Employees);
        //        exit;
        $user[0]['employee'] = $Employees;
        return $user;
    }

    private function getmygallery($user_id)
    {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        $images_info = array();
        if (count($user_meta) > 0) {
            $assets_ids = unserialize($user_meta[0]->value);
            foreach ($assets_ids as $cat_id => $catimages) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();


                foreach ($catimages as $imgid => $imagtitle) {
                    $image_id = $imgid;
                    $image_title = $imagtitle['title'];
                    if (!empty($image_id)) {
                        $assets = \DB::table('assets')->where(array('id' => $image_id))->get();
                        //print_r($assets);
                        foreach ($assets as $asset) {
                            $images_info[] = array(
                                'asset_id' => $asset->id,
                                'image_name' => 'thumb_medium_' . $asset->name,
                                'image_org' => $asset->name,
                                'image_path' => $asset->path,
                                'image_title' => $image_title,
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

    private function getvideogallery($user_id)
    {
        $videos_info = array();
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->get();
        if (count($user_meta) > 0) {
            $video_infos = unserialize($user_meta[0]->value);

            foreach ($video_infos as $cat_id => $catvideos) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();


                foreach ($catvideos as $videoid => $videoinfo) {
                    $video_id = $videoid;
                    $video_title = $videoinfo['title'];
                    $video_link = (isset($videoinfo['YouTubeLink'])) ? $videoinfo['YouTubeLink'] : '';
                    $video_embed_link = 'http://www.youtube.com/embed/' . $video_id;
                    if (!empty($video_id)) {
                        $videos_info[] = array(
                            'video_id' => $video_id,
                            'video_title' => $video_title,
                            'video_cat' => $cate_info[0]->name,
                            'cat_id' => $cate_id,
                            'video_emb_link' => $video_embed_link
                        );
                    }
                }
            }
        }
        return $videos_info;
    }

    public function checkCustomerInfo($userinfo, $sp_id)
    {

        $customerInfo = array();
        if ($userinfo) {
            $userName = explode(' ', $userinfo->name);
            $first_name = '';
            $last_name = '';
            if (count($userName) == 1) {
                $first_name = $userName[0];
            } else if (count($userName) == 2) {
                $first_name = $userName[0];
                $last_name = $userName[1];
            } else {
                $first_name = $userName[0];
                array_shift($userName);
                $last_name = implode(' ', $userName);
            }
            $customers = Customers::where('email', $userinfo->email)->get();
            //            print_r($customers);
            //            exit;
            if ($customers->count() > 0) {
                $have = 0;
                foreach ($customers->toArray() as $key => $values) {
                    if ($values['parent_id'] == $sp_id) {
                        $have = $values;
                        break;
                    }
                }
                if ($have) {
                    $obj_customer = Customers::find($have['id']);
                    $obj_customer->web_account_type = '1';
                    $obj_customer->user_id = $userinfo->id;
                    $obj_customer->update();
                    $customerInfo = $have['id'];
                } else {
                    $obj_customer = new Customers();
                    $obj_customer->user_id = $userinfo->id;
                    $obj_customer->email = $userinfo->email;
                    $obj_customer->first_name = $first_name;
                    $obj_customer->last_name = $last_name;
                    $obj_customer->active = '1';
                    $obj_customer->web_account_type = '1';
                    $obj_customer->parent_id = $sp_id;
                    $obj_customer->profile_pic = $userinfo->profile_pic;
                    $obj_customer->customer_id = $this->getCustomerRegisterId($sp_id);
                    $obj_customer->save($customerInfo);
                    $customerInfo = $obj_customer->id;
                }
            } else {
                $obj_customer = new Customers();
                $obj_customer->user_id = $userinfo->id;
                $obj_customer->email = $userinfo->email;
                $obj_customer->first_name = $first_name;
                $obj_customer->last_name = $last_name;
                $obj_customer->active = '1';
                $obj_customer->web_account_type = '1';
                $obj_customer->parent_id = $sp_id;
                $obj_customer->profile_pic = $userinfo->profile_pic;
                $obj_customer->customer_id = $this->getCustomerRegisterId($sp_id);
                $obj_customer->save($customerInfo);
                $customerInfo = $obj_customer->id;
            }
        }
        return $customerInfo;
    }

    public function getCustomerRegisterId($id)
    {
        $customer = Customers::where('parent_id', $id)->select('customer_id')->orderBy('id', 'DESC')->first();
        $values = '';
        if (empty($customer->customer_id)) {
            $values = 1000;
        } else {
            $values = $customer->customer_id + 1;
        }
        return $values;
    }


    public function ApiPostBooking(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        $bookinginfo = $request->all();
        if ($bookinginfo) {
            $customer_id = $bookinginfo['user_id'];
            $res = Booking::onlineBooking($bookinginfo);
            if ($res['status'] == "200") {
                $objBooking = Booking::find($res['bookingId']);
                $this->triggerBookingNotification($objBooking->id, $bookinginfo['businessid']);
                $booking_services = array();
                $booking_price = 0;
                foreach ($objBooking->services as $service) {
                    if ($service['serviceType'] === 0) {
                        $booking_services[] = $service->service['title'];
                        $booking_price += (int)$service->service['price'];
                    } else {
                        $booking_services[] = $service->listing['title'];
                        $booking_price += (int)$service->listing['price'];
                    }
                }
                $userdetail = \DB::table('users')->join('user_business', 'users.id', '=', 'user_business.user_id')->join('assets', 'assets.id', '=', 'users.profile_pic', 'left outer')->where('users.id', $objBooking->user_id)->first();
                $bookingData = array("booking" => $objBooking->toArray(), 'booking_price' => $booking_price, 'userdetail' => $userdetail, 'booking_services' => implode(',', $booking_services), "user" => $objBooking->user->toArray());
                $results = array("status" => "200", "user" => $customer_id, "msg" => "Fetch Successfully", "booking" => $bookingData);
            } else {
                $results = array("status" => "210", "user" => $customer_id, "msg" => "This Slot is not Available");
            }
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function triggerBookingNotification($id, $userid)
    {
        $url = env('StylerBook_Url') . '/onlineBooking';
        $ch = curl_init();
        $fields = [
            'id'      => $id
        ];
        $fields_string = http_build_query($fields);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
        curl_setopt($ch, CURLOPT_REFERER, env('APP_URL'));
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $rawBody = curl_exec($ch);
        curl_close($ch);
        if ($rawBody != '200') {
            $message = 'Booking Not Found';
            if ($rawBody == 'Method Not Allowed') {
                $message = 'Method Not Allowed';
            }
            \DB::table("cronjob_errors")->insert(
                ['user_id' => $userid, 'type' => 2, 'error_message' => $message, 'created_at' => date('Y-m-d h:i:s'), 'updated_at' => date('Y-m-d h:i:s')]
            );
        }
        return $id;
    }

    public function apigetuserbooking(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('id')) {
            if (!$request->has('type')) {
                $bookingInfo = Booking::with('customer')->whereHas('customer', function ($query) use ($request) {
                    $query->where('user_id', '=', $request->input('id'));
                })->orderBy('id', 'desc')->get();
            } else
                $bookingInfo = Booking::where('id', $request->input('id'))->orderBy('id', 'desc')->get();
            $bookingData = array();
            foreach ($bookingInfo as $booking) {
                $booking_services = array();
                $booking_price = 0;
                foreach ($booking->services as $service) {
                    if ($service['serviceType'] === 0) {
                        $booking_services[] = $service->service['title'];
                        $booking_price += (int)$service->service['price'];
                    } else {
                        $booking_services[] = $service->listing['title'];
                        $booking_price += (int)$service->listing['price'];
                    }
                }
                $userdetail = \DB::table('users')->join('user_business', 'users.id', '=', 'user_business.user_id')->join('assets', 'assets.id', '=', 'users.profile_pic', 'left outer')->where('users.id', $booking->user_id)->first();
                $bookingData[] = array("booking" => $booking->toArray(), 'booking_price' => $booking_price, 'userdetail' => $userdetail, 'booking_services' => implode(',', $booking_services), "user" => $booking->user->toArray());
            }
            $total_records = count($bookingData);
            $bookingData = array_chunk($bookingData, 10);
            $results = array("status" => "200", "Booking" => array("bookingData" => $bookingData, "total_records" => $total_records), "msg" => "Fetch Successfully");
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function randomString($length = 6)
    {
        $str = "";
        $characters = array_merge(range('0', '9'));
        $max = count($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $rand = mt_rand(0, $max);
            $str .= $characters[$rand];
        }
        return $str;
    }

    public function RestUserPassword(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'password' => 'required|confirmed',
        ]);

        if ($validator->fails()) {
            $message = $validator->messages()->toArray();
            $results = array("status" => "210", "msg" => $message);
        } else {
            $user = \App\Models\Access\User\User::findOrFail($request->input('userId'));
            if (\Illuminate\Support\Facades\Hash::check($request->input('old_password'), $user->password)) {

                $user->fill([
                    'password' => \Illuminate\Support\Facades\Hash::make($request->input('password'))
                ])->save();
                $results = array("status" => "200", "msg" => "Successfully change.");
            } else {
                $results = array("status" => "210", "msg" => "Current Password not valid.");
            }
        }
        return $results;
    }

    public function ApiAddtowatchlist(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('id')) {
            $results = $this->user->ApiAddtowatchlist($request->all());
            if ($results['status'] == '200') {
                $data = \Illuminate\Support\Facades\DB::select("SELECT t1.id as watchlist_id, t1.item_id as listing_id, t1.watchtype,t1.created_at as watch_include_at, t2.* FROM `watch_list` t1 join listing t2 on(t1.item_id = t2.id) where t1.watchtype = 'listing' and t1.user_id = " . $request->input('userId') . " and t1.item_id = " . $request->input('id') . " order by t1.created_at Desc");
                if ($data) {
                    foreach ($data as $listing) {
                        // $assets = $this->getJobGalleryImages($listing->user_id);
                        // if ($assets) {
                        //     $listing->assets = $this->getJobGalleryImages($listing->user_id);
                        // }
                        $listing->userdetail = \DB::table('users')->join('user_business', 'users.id', '=', 'user_business.user_id')->join('assets', 'assets.id', '=', 'users.profile_pic', 'left outer')->where('users.id', $listing->user_id)->first();
                        $list = Listing::find($listing->id);
                        $listing->assets = $list->assets;
                        $listing->listingMeta = $list->listingMeta;
                        $services = array();
                        foreach ($list->listService as $deal) {
                            $services[] = $deal->service;
                        }
                        $listing->listService = $services;
                    }
                }
                $results['watchlist'] = $data;
            }
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function ApiGetUserWatchList(Request $request)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        if ($request->has('id')) {
            if (!$request->has('type'))
                $data = \Illuminate\Support\Facades\DB::select("SELECT t1.id as watchlist_id, t1.item_id as listing_id, t1.watchtype,t1.created_at as watch_include_at, t2.* FROM `watch_list` t1 join listing t2 on(t1.item_id = t2.id) where t1.watchtype = 'listing' and t1.user_id = " . $request->input('id') . " order by t1.created_at Desc");
            else
                $data = Listing::where('id', $request->input('id'))->get();
            if ($data) {
                foreach ($data as $listing) {
                    // $assets = $this->getJobGalleryImages($listing->user_id);
                    // if ($assets) {
                    //     $listing->assets = $this->getJobGalleryImages($listing->user_id);
                    // }
                    $listing->userdetail = \DB::table('users')->join('user_business', 'users.id', '=', 'user_business.user_id')->join('assets', 'assets.id', '=', 'users.profile_pic', 'left outer')->where('users.id', $listing->user_id)->first();
                    // $listing->listingMeta=\DB::table('listing')->join('listing_meta', 'listing.id', '=', 'listing_meta.listing_id')->where('listing.id', $listing->id)->get();
                    // $listing->listService=\DB::table('listing')->join('listing_meta', 'listing.id', '=', 'listing_meta.listing_id')->where('listing.id', $listing->id)->get();
                    // foreach($listing->listService as $deal){
                    //     $deal->service;
                    // }
                    $list = Listing::find($listing->id);
                    $listing->listing_categories = $list->listingCategories;
                    $listing->assets = $list->assets;
                    $listing->sharing_url = url('classifieds?id=' . base64_encode($list->id));
                    $listing->listingMeta = $list->listingMeta;
                    $services = array();
                    foreach ($list->listService as $deal) {
                        if ($deal->service)
                            $services[] = $deal->service;
                    }
                    $listing->listService = $services;
                }
            }
            $results = array("status" => "200", "data" => $data, "msg" => "Fetch Successfully");
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function getJobGalleryImages($user_id)
    {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        $images_info = array();

        if (count($user_meta) > 0) {
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

    public function updateAccount($id, Request $request)
    {
        try {
            $results = $this->user->ApiUpdateProfile($id, $request->all());
            return array("status" => "200", "msg" => "Successfully update", "userid" => $id);
        } catch (Exception $e) {
            return array("status" => "210", "msg" => $e->getMessage(), "userid" => $id);
        }
    }

    public function Apiupdateprofile(Request $request)
    {
        $data = $request->all();
        // return json_encode(array("data"=>$data));
        try {
            if ($data['profile_pic'] != "") {
                $file = $data['profile_pic'];
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(
                    public_path() . '/assets/user/large/',
                    $fileName
                );
                $assets = new Assets();
                $assets->name = $fileName;
                $assets->path = '/assets/user/large/';
                $assets->ext = $file->getClientOriginalExtension();
                $assets->save();
                $user = User::find($data['user_id']);
                $assets->userPicture()->save($user);
            }
            return array("status" => "200", "msg" => "Successfully update", "assets" => $assets);
        } catch (Exception $e) {
            return array("status" => "210", "msg" => $e->getMessage(), "userid" => $data['user_id']);
        }
    }

    public function deleteWatchlist(Request $request)
    {
        $data = $request->all();
        try {
            $status = \DB::table('watch_list')->where('id', $data['id'])->delete();
            return array("status" => "200", "msg" => "Successfully update", "action" => $status);
        } catch (Exception $e) {
            return array("status" => "210", "msg" => $e->getMessage(), "userid" => $data['user_id']);
        }
    }

    public function createReview(Request $request)
    {
        try {
            $input = $request->all();
            if ($request->has('from_user')) {
                $input['from_user'] = $request->input('from_user');
                $from_user = \App\Models\Access\User\User::find($request->input('from_user'));
                $input['name'] = $from_user->name;
                $input['email'] = $from_user->email;
                $list = $this->reviews->create($input);
                if (isset($list['status']) && $list['status'] == "Already Review") {
                    return response()->json(array("status" => "210", "msg" => $list['status'], "latest_review" => []), 200);
                } else {
                    return response()->json(array("status" => "200", "msg" => "Successfully Review", "latest_review" => $list), 200);
                }
            } else {
                return response()->json(array("status" => "210", "msg" => "From user not found.", "latest_review" => []), 200);
            }
        } catch (Exception $e) {
            return response()->json(array("status" => "210", "msg" => $e->getMessage(), "latest_review" => ""), 200);
        }
    }
    public function saveNotifications(Request $request)
    {
        try {
            $input = $request->all();
            if ($request->has('userId')) {
                $record = array('user_id' => $input['userId'], 'fcm_token' => $input['fcmToken'], 'notifications' => $input['notifications'], 'schedule_notifications' => $input['schedule']);
                if (\DB::table('push_notifications')->where('user_id', $input['userId'])->count() > 0) {
                    $time = array('updated_at' => \Carbon\Carbon::now());
                    $data = \DB::table('push_notifications')->where('user_id', $input['userId'])->update(array_merge($record, $time));
                } else {
                    $time = array('updated_at' => \Carbon\Carbon::now(), 'created_at' => \Carbon\Carbon::now());
                    $data = \DB::table('push_notifications')->insert(array_merge($record, $time));
                }
                return response()->json(array("status" => "200", "msg" => $data), 200);
            } else {
                return response()->json(array("status" => "210", "msg" => "User not found."), 200);
            }
        } catch (Exception $e) {
            return response()->json(array("status" => "210", "msg" => $e->getMessage()), 200);
        }
    }
    public function getNotifications(Request $request)
    {
        try {
            $input = $request->all();
            if ($request->has('userId')) {
                if (\DB::table('push_notifications')->where('user_id', $input['userId'])->count() > 0) {
                    $data = \DB::table('push_notifications')->where('user_id', $input['userId'])->first();
                    return response()->json(array("status" => "200", "data" => $data), 200);
                }
                return response()->json(array("status" => "210", "msg" => 'Record not found.'), 200);
            } else {
                return response()->json(array("status" => "210", "msg" => "User not found."), 200);
            }
        } catch (Exception $e) {
            return response()->json(array("status" => "210", "msg" => $e->getMessage()), 200);
        }
    }
}
