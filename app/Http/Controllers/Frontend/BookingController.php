<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\User\PaymentsRequest;
use App\Models\GalleryLikes\GalleryLikes;
use App\Repositories\Frontend\User\UserContract;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Http\Requests\Frontend\Pages\GetPageRequest;
use App\Models\UserSubscription\UserSubscription;
use App\Jobs\StylerZoneEmails;
use Redirect;
use URL;
use Omnipay\Omnipay;
use Session;
use DB;
use Mail;
use App\Businessservices;
use App\Review;
use App\Employee;
use Illuminate\Http\Request;
use Auth;
use App\Booking;
use App\BookingServices;
use App\Models\Booking\bookingdeal;
use App\Models\Access\User\User;
use Illuminate\Mail\Message;
use App\Models\Customers\Customers;

//use App\Businessservices;

class BookingController extends Controller
{

    function __construct(UserContract $user, AssetsContract $assets)
    {
        $this->user = $user;
        $this->assets = $assets;
    }

    public function index($user_id)
    {
        $userId = array("id" => base64_decode($user_id));
        $user = $this->getUserInfo($userId);
        return view('frontend.booking.booking')->withRecord($user)->withUserid($user_id);
    }

    public function getUserInfo($user_id)
    {
        $user = $this->user->getUserDetail(array("id" => $user_id));
        $user[0]['gallery'] = $this->getmygallery($user_id);
        $video_gallery = $this->getvideogallery($user_id);
        $user[0]['video_gallery'] = $video_gallery;
        $Businessservices = Businessservices::where('author', $user_id)
            ->where('active', '1')
            ->where('service_online', '1')
            ->get()->toArray();
        $user[0]['business_services'] = $Businessservices;
        $popular_services = collect($Businessservices);
        $reviews = Review::reviewWithreply($user_id);
        $user[0]['reviewWithreply'] = $reviews;
        $user[0]['popularServices'] = $popular_services->where("popular_service", 1);
        $user[0]['business_services'] = $popular_services->where("popular_service", 0);
        $Employees = array();
        if (isset($user[0]->Employee[0]) && $user[0]->Employee[0]) {
            foreach ($user[0]->Employee as $key => $info) {
                if ($info->employee_schedule) {
                    $info->employee_schedule = \GuzzleHttp\json_decode($info->employee_schedule);
                    $newArray = array_merge($info->toArray(), array("bookinghours" => $info->EmployeeBookingHours->toArray()));
                    $newArray = array_merge($newArray, array("blockTime" => $info->EmployeeBlockTime->toArray()));
                    unset($newArray['password']);
                    $Employees[] = $newArray;
                }
            }
        }
        $user[0]['employee'] = $Employees;
        return $user;
    }

    private function getmygallery($user_id)
    {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        //        print_r($user_meta->count());
        //        exit;
        $images_info = array();
        if (isset($user_meta) && $user_meta->count() > 0) {
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
        if (isset($user_meta) && $user_meta->count() > 0) {
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

    public function checklogin(Request $request)
    {
        $auth = "210";
        $status = "210";
        if (Auth::check()) {
            $auth = "200";
        }
        $bookinginfo = $request->all();
        $request->session()->put('booking', $request->all());
        if ($auth == "200") {
            $bookinginfo['user_id'] = Auth::user()->id;
            $res = $this->appointmentBooking($bookinginfo);
            if ($res['status'] == "200") {
                $user = array("id" => Auth::user()->id, "start_date" => $bookinginfo['start_date'], "sp_id" => base64_decode($bookinginfo['businessid']));
                $this->triggerBookingNotification($res['bookingId'], $res['businessid']);
                $this->sendMailToServicesBookingCustomer($user, $bookinginfo['services']);
                Session::forget('booking');
                $status = "200";
            }
        }
        //        print_r(session('booking'));
        //        exit;
        //        Session::set('booking', $request->all());
        return \GuzzleHttp\json_encode(array("auth" => $auth, "status" => $status, 'redirect_url' => URL('/account#/settings/booking?id=1')));
    }

    public function booknow()
    {
        $user_id = Auth::user()->id;
        $bookingInfo = session('booking');
        //        $bookingInfo = Session::get('booking');
        return view('frontend.booking.booknow')->withUserid($user_id)->withBookinginfo($bookingInfo);
    }

    public function appointmentBooking($bookinginfo)
    {
        if ($bookinginfo) {
            $bookinginfo['businessid'] = base64_decode($bookinginfo['businessid']);
            $res = Booking::onlineBooking($bookinginfo);
            return $res;
        }
    }

    public function postBookNow(Request $request)
    {
        $bookinginfo = session('booking');
        $status = "210";
        if (Auth::check()) {
            return redirect(URL('/auth/login'));
        }
        //        $bookinginfo = Session::get('booking');
        $bookinginfo['user_id'] = Auth::user()->id;
        $res = $this->appointmentBooking($bookinginfo);
        if ($res['status'] == "200") {
            $user = array("id" => Auth::user()->id, "start_date" => $bookinginfo['start_date'], "sp_id" => base64_decode($bookinginfo['businessid']));
            $this->triggerBookingNotification($res['bookingId'], $res['businessid']);
            $this->sendMailToServicesBookingCustomer($user, $bookinginfo['services']);
            Session::forget('booking');
            $status = "200";
        }
        if ($status == "200")
            return redirect(URL('/account#/settings/booking?id=1'));
        else return redirect(URL('/booking/' . $bookinginfo['businessid']));
        exit();

        $user = array("id" => Auth::user()->id, "start_date" => $bookinginfo['start_date'], "sp_id" => base64_decode($bookinginfo['businessid']));
        $date = date('Y-m-d', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date']))));
        $bookinginfo['businessid'] = base64_decode($bookinginfo['businessid']);

        //        $customer_id = Auth::user()->id;
        $customer_info = User::where('id', Auth::user()->id)->get()->first();
        $customer_id = $this->checkCustomerInfo($customer_info, base64_decode($bookinginfo['businessid']));
        $objBooking = new Booking();
        $objBooking->user_id = $bookinginfo['businessid'];
        $objBooking->time = $bookinginfo['start_date'];
        $objBooking->end_time = $bookinginfo['end_date'];
        $objBooking->totalprice = $bookinginfo['total_price'];
        $objBooking->date = $date;
        $objBooking->customer_id = $customer_id;
        $objBooking->discount = 0;
        $objBooking->status = 'Pending';
        $objBooking->front_booked = 1;
        $objBooking->save();
        $bookingId = $objBooking->id;
        $count = 0;
        $processing_time = '';
        foreach ($bookinginfo['services'] as $data) {
            $busService = Businessservices::find($data);
            if ($busService) {
                if ($count === 0) {
                    $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date']))));
                    $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date'] . "+" . $busService['duration'] . " minutes"))));
                } else {
                    if ($busService['process_time'] && !empty($busService['process_time'])) {
                        $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($end_date . "+" . $processing_time . " minutes"))));
                    } else {
                        $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($end_date))));
                    }
                    $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($start_date . "+" . $busService['duration'] . " minutes"))));
                }
                $objBookingService = new BookingServices();
                $objBookingService->booking_id = $bookingId;
                $objBookingService->service_id = $data;
                $objBookingService->employee_id = $bookinginfo['employeeid'];
                $objBookingService->date = $date;
                $objBookingService->employee_id = $bookinginfo['employeeid'];
                $objBookingService->time = $start_date;
                $objBookingService->end_time = $end_date;
                $objBookingService->book_id = $this->randomString(6) . '-' . $this->randomString(6);
                $objBookingService->status = 'active';
                $objBookingService->save();
            }
            $count++;
            $processing_time = $busService['process_time'];
        }
        $this->triggerBookingNotification($bookingId, $bookinginfo['businessid']);
        $this->sendMailToServicesBookingCustomer($user, $bookinginfo['services']);
        Session::forget('booking');
        return redirect(URL('/account#/settings/booking?id=1'));
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

    public function getbooking()
    {
        $customer_ids = $this->getCustomerIds(Auth::user()->id);
        if (Auth::user()->roles[0]->name == "Individual" || Auth::user()->roles[0]->name == "JobSeeker") {
            $bookingInfo = Booking::whereIn('customer_id', $customer_ids)->orderBy('id', 'desc')->get();
        } else {
            $bookingInfo = Booking::whereIn('customer_id', $customer_ids)->orderBy('id', 'desc')->get();
        }
        $bookingData = array();
        foreach ($bookingInfo as $booking) {
            $booking_services = array();
            foreach ($booking->services as $service) {
                $booking_services[] = $service->service['title'];
            }
            //            echo "<pre>";
            //           print_r($booking->toArray());
            ////            exit;
            //                        print_r($booking->customer()->get()->toArray());
            //                        exit;
            $bookingData[] = array("booking" => $booking->toArray(), 'booking_services' => implode(',', $booking_services), "customer" => $booking->customer->toArray());
        }
        $total_records = count($bookingData);
        $bookingData = array_chunk($bookingData, 10);
        return \GuzzleHttp\json_encode(array("bookingData" => $bookingData, "total_records" => $total_records));
    }

    public function getCustomerIds($user_id)
    {
        $customer_ids = Customers::where('user_id', $user_id)->get()->pluck('id')->toArray();
        return $customer_ids;
    }

    public function cancelbooking(Request $request)
    {
        try {
            $bookingId = $request->input('bookingid');
            $obj_Booking = Booking::find($bookingId);
            $obj_Booking->status = 'Cancel';
            $obj_Booking->save();
            return \GuzzleHttp\json_encode('200');
        } catch (Exception $e) {
            return \GuzzleHttp\json_encode('210');
        }
    }

    public function booklater(Request $request)
    {
        $results = array();

        if ($request->all()) {
            $requestInfo = $request->all();
            $requestInfo['start_date'] = '';
            if (!$user_id = $this->user->userEmailCheck($requestInfo['uemail'])) {
                $user = $this->saveUser($request->except(['listingid']));
            } else {
                $user = array("id" => $user_id, "password" => "", "sp_id" => $this->getSpId($requestInfo['listing_id']));
            }
            $this->saveSendMailTOUsers($user, $requestInfo);
            $results = array(
                "status" => "200",
                "error_msg" => "Check your email.",
            );
        } else {
            $results = array(
                "status" => "220",
                "error_msg" => "Parameters are require",
            );
        }
        return json_encode($results);
        exit;
    }

    public function saveUser($data)
    {
        try {
            $data['userpassword'] = $this->randomPassword();
            $data['password'] = bcrypt($data['userpassword']);

            $data['name'] = $data['fname'] . ' ' . $data['lname'];


            $user = User::create(array("name" => $data['name'], "email" => $data['uemail'], "password" => $data['password'], "confirmation_code" => md5(uniqid(mt_rand(), true))));

            DB::table('assigned_roles')->insert(['user_id' => $user->id, 'role_id' => 3]);
            $data['user_info']['parent_id'] = (isset($data['listing_id'])) ? $this->getSpId($data['listing_id']) : '';
            if (!$user->user_info) {
                $data['user_info']['user_id'] = $user->id;
                $save_array = array("user_id" => $user->id, "contact_number" => $data['contact_number'], "parent_id" => (isset($data['listing_id'])) ? $this->getSpId($data['listing_id']) : '0');
                $user->userInfo()->create($save_array);
            } else {
                $user->userInfo->update($data['user_info']);
            }
            $userDetail = $user->toArray();
            $userDetail['password'] = $data['userpassword'];
            $this->dispatch((new StylerZoneEmails($userDetail, 'emails.booking.deal_booking_create_user')));
            //            Mail::send('emails.booking.deal_booking_create_user', $userDetail, function ($message) use ($userDetail) {
            //                $message->to($userDetail['email'], $userDetail['name'])->subject('StylerZone Login Details');
            //                $message->from('kinectro.development@gmail.com', 'StylerZone');
            //            });

            return array("id" => $user->id, "user" => $user, "password" => $data['userpassword'], "sp_id" => (isset($data['user_info']['parent_id']) && !empty($data['user_info']['parent_id'])) ? $data['user_info']['parent_id'] : '0');
        } catch (Expection $e) {
            return array("status" => "220", "error_msg" => $e->getMessage());
        }
    }

    public function randomPassword()
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

    public function getSpId($listing_id)
    {
        $obj_listing = \App\Models\Listing\Listing::find($listing_id);
        return $obj_listing->user_id;
    }

    public function saveSendMailTOUsers($user, $requestInfo, $status = 0)
    {
        try {
            $obj_sp = \App\Models\Access\User\User::find($user['sp_id']);
            $obj_deal = \App\Models\Listing\Listing::find($requestInfo['listing_id'])->toArray();

            $bookDetail = array("later_token" => "", "customer_id" => $user['id'], "customer_info" => $requestInfo, "deal" => $obj_deal, "sevrice_provider" => $obj_sp->UserBusiness->toArray());
            $obj_deal_book = new bookingdeal();
            $obj_deal_book->listing_id = $bookDetail['deal']['id'];
            $obj_deal_book->later_deal_token = $bookDetail['later_token'];
            $obj_deal_book->status = $status;
            $obj_deal_book->deal_duation = $bookDetail['deal']['duration'];
            $obj_deal_book->user_id = $bookDetail['customer_id'];
            $obj_deal_book->save();
            $bookDetail['later_token'] = base64_encode($obj_deal_book->id);
            $book_deal_token_update = bookingdeal::find($obj_deal_book->id);
            $book_deal_token_update->later_deal_token = $bookDetail['later_token'];
            $book_deal_token_update->save();
            $bookDetail = array(
                "later_token" => $bookDetail['later_token'],
                "customer_id" => base64_encode($user['id']),
                "customer_info" => $requestInfo,
                "deal" => $obj_deal,
                "sevrice_provider" => $obj_sp->UserBusiness->toArray(),
                "starting_time" => $requestInfo['start_date'],
                "status" => $status
            );
            $this->dispatch((new StylerZoneEmails($bookDetail, 'emails.booking.deal_book_customer')));
            //            Mail::send('emails.booking.deal_book_customer', $bookDetail, function ($message) use ($bookDetail) {
            //                $message->to($bookDetail['customer_info']['uemail'], ($bookDetail['customer_info']['fname'] . " " . $bookDetail['customer_info']['lname']))->subject('Booking Confirmation');
            //                $message->from('kinectro.development@gmail.com', 'StylerZone');
            //            });
            $this->dispatch((new StylerZoneEmails($bookDetail, 'emails.booking.deal_book_sp')));
            //            Mail::send('emails.booking.deal_book_sp', $bookDetail, function ($message) use ($bookDetail) {
            //                $message->to($bookDetail['sevrice_provider']['business_email'], $bookDetail['sevrice_provider']['business_email'])->subject('Booking Confirmation');
            //                $message->from('kinectro.development@gmail.com', 'StylerZone');
            //            });
            return 1;
        } catch (Exception $e) {
            $e->getMessage();
            return 0;
        }
    }

    public function booklaterwithauth(Request $request)
    {
        $listing_id = base64_decode($request->input('listing_id'));
        $sp_id = $this->getSpId($listing_id);
        $user = array("id" => Auth::user()->id, "password" => "", "sp_id" => $sp_id);
        $userinfo = explode(' ', Auth::user()->name);
        $requestDetails = array(
            "listing_id" => $listing_id,
            "fname" => isset($userinfo[0]) ? $userinfo[0] : '',
            "lname" => isset($userinfo[1]) ? $userinfo[1] : '',
            "uemail" => Auth::user()->email,
            "contact_number" => Auth::user()->userInfo->contact_number,
            "start_date" => ''
        );
        if ($this->saveSendMailTOUsers($user, $requestDetails)) {
            $results = array(
                "status" => "200",
                "error_msg" => "Check your email.",
            );
        } else {
            $results = array(
                "status" => "220",
                "error_msg" => "Parameters are require",
            );
        }
        return \GuzzleHttp\json_encode($results);
    }

    public function dealBookNow(Request $request)
    {
        $result = array(
            "status" => "200",
            "msg" => "Check your email.",
        );
        if ($request->all()) {
            $requestInfo = $request->all();
            if (!$user_id = $this->user->userEmailCheck($requestInfo['uemail'])) {
                $user = $this->saveUser($request->except(['date', 'time', 'start_date', 'end_date', 'employeeid']));
                $customer_info = $user['user'];
            } else {
                $user = array("id" => $user_id, "password" => "", "sp_id" => $this->getSpId($requestInfo['listing_id']));
                $customer_info = User::where('id', $user_id)->get()->first();
            }
            $date = date('Y-m-d', strtotime(date('Y-m-d H:i:s', strtotime($requestInfo['start_date']))));
            $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($requestInfo['start_date']))));
            $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($requestInfo['end_date']))));
            $res = Booking::checktimeIntervalEmployee($requestInfo['employeeid'], $start_date, $end_date, $date, null, $serviceType = 0);
            if ($res['status'] == "200") {
                $objBooking = new Booking();
                $objBooking->user_id = $user['sp_id'];
                $objBooking->time = $requestInfo['start_date'];
                $objBooking->end_time = $requestInfo['end_date'];
                $objBooking->totalprice = $requestInfo['total_price'];
                $objBooking->date = $date;
                $objBooking->customer_id = $this->checkCustomerInfo($customer_info, $user['sp_id']);
                //            $user['id'];
                // $objBooking->discount = $this->dealDiscountPercentage($requestInfo['listing_id']);
                $objBooking->discount = 0;
                $objBooking->status = 'Pending';
                $objBooking->front_booked = '1';
                $objBooking->save();
                $bookingId = $objBooking->id;
                $listingService = \App\Models\Listing\Listing::find($requestInfo['listing_id'])->toArray();
                $objBookingService = new BookingServices();
                $objBookingService->booking_id = $bookingId;
                $objBookingService->service_id = $requestInfo['listing_id'];
                $objBookingService->employee_id = $requestInfo['employeeid'];
                $objBookingService->date = $date;
                $objBookingService->time = $start_date;
                $objBookingService->end_time = $end_date;
                $objBookingService->duration = $listingService['duration'];
                $objBookingService->price = $listingService['saving'];
                $objBookingService->book_id = $this->randomString(6) . '-' . $this->randomString(6);
                $objBookingService->status = 'active';
                $objBookingService->serviceType = 1;
                $objBookingService->save();
                $this->triggerBookingNotification($bookingId, $user['sp_id']);
                $this->saveSendMailTOUsers($user, $requestInfo, 2);
            } else {
                $result = $res;
            }
        }
        return \GuzzleHttp\json_encode($result);
        exit;
    }

    public function dealBookNowAuth(Request $request)
    {
        $result = array(
            "status" => "200",
            "msg" => "Check your email.",
        );
        $request->merge(array("listing_id" => base64_decode($request->input('listing_id'))));
        $listing_id = $request->input('listing_id');
        $sp_id = $this->getSpId($listing_id);
        $user = array("id" => Auth::user()->id, "password" => "", "sp_id" => $sp_id);
        $userinfo = explode(' ', Auth::user()->name);
        $requestDetails = array(
            "listing_id" => $listing_id,
            "fname" => isset($userinfo[0]) ? $userinfo[0] : '',
            "lname" => isset($userinfo[1]) ? $userinfo[1] : '',
            "uemail" => Auth::user()->email,
            "contact_number" => Auth::user()->userInfo->contact_number,
            "start_date" => $request->input('start_date')
        );

        $requestInfo = $request->all();
        $data['some']['thing'] = 'value';
        $request->merge($data);
        $date = date('Y-m-d', strtotime(date('Y-m-d H:i:s', strtotime($requestInfo['start_date']))));
        $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($requestInfo['start_date']))));
        $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($requestInfo['end_date']))));
        $res = Booking::checktimeIntervalEmployee($requestInfo['employeeid'], $start_date, $end_date, $date, null, $serviceType = 0);
        if ($res['status'] == "200") {
            $customer_info = User::where('id', $user['id'])->get()->first();
            $customer_id = $this->checkCustomerInfo($customer_info, $user['sp_id']);
            $objBooking = new Booking();
            $objBooking->user_id = $user['sp_id'];
            $objBooking->time = $requestInfo['start_date'];
            $objBooking->end_time = $requestInfo['end_date'];
            $objBooking->totalprice = $requestInfo['total_price'];
            $objBooking->date = $date;
            //        $objBooking->customer_id = $user['id'];
            $objBooking->customer_id = $customer_id;
            //        $objBooking->discount = $this->dealDiscountPercentage($requestInfo['listing_id']);
            $objBooking->discount = '0';
            $objBooking->status = 'Pending';
            $objBooking->front_booked = '1';
            $objBooking->save();
            $listingService = \App\Models\Listing\Listing::find($requestInfo['listing_id'])->toArray();
            $bookingId = $objBooking->id;
            $objBookingService = new BookingServices();
            $objBookingService->booking_id = $bookingId;
            $objBookingService->service_id = $requestInfo['listing_id'];
            $objBookingService->employee_id = $requestInfo['employeeid'];
            $objBookingService->date = $date;
            $objBookingService->time = $start_date;
            $objBookingService->end_time = $end_date;
            $objBookingService->duration = $listingService['duration'];
            $objBookingService->price = $listingService['saving'];
            $objBookingService->book_id = $this->randomString(6) . '-' . $this->randomString(6);
            $objBookingService->status = 'active';
            $objBookingService->serviceType = 1;
            $objBookingService->save();
            $this->triggerBookingNotification($bookingId, $user['sp_id']);
            $this->saveSendMailTOUsers($user, $requestDetails, 2);
        } else {
            $result = $res;
        }
        return \GuzzleHttp\json_encode($result);
    }

    private function dealDiscountPercentage($listing_id)
    {
        $deal = \App\Models\Listing\Listing::find($listing_id);
        $discount_in_per = (((int)$deal->discount / (int)$deal->dealprice) * 100);
        return $discount_in_per;
    }

    public function boookingServicesUserCreate(Request $request)
    {

        $userinfo = $request->all();
        $user = '';
        $bookinginfo = Session::get('booking');
        //        print_r($bookinginfo);
        //        exit;

        if ($userinfo) {
            if (!($user_id = $this->user->userEmailCheck($userinfo['uemail']))) {
                $user = $this->saveUser($userinfo);
                $user_id = $user['id'];
            } else {
                $user = array("id" => $user_id, "start_date" => $bookinginfo['start_date'], "password" => "", "sp_id" => isset($userinfo['listing_id']) ? $this->getSpId($userinfo['listing_id']) : '0');
            }
            $customer_info = User::where('id', $user_id)->get()->first();
            $status = '210';
            $bookinginfo['user_id'] = $user_id;
            $res = $this->appointmentBooking($bookinginfo);
            if ($res['status'] == "200") {
                $user = array("id" => $user_id, "start_date" => $bookinginfo['start_date'], "sp_id" => base64_decode($bookinginfo['businessid']));
                $this->triggerBookingNotification($res['bookingId'], $res['businessid']);
                $this->sendMailToServicesBookingCustomer($user, $bookinginfo['services']);
                Session::forget('booking');
                $status = "200";
            }
            return json_encode(array("status" => $status, "error_msg" => "Booking successfully done.Please check your mail."));
        }
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

    public function sendMailToServicesBookingCustomer($user, $services)
    {
        $obj_sp = \App\Models\UserBusiness\UserBusiness::where('user_id', $user['sp_id'])->get()->toArray();
        $obj_customer = \App\Models\Access\User\User::find($user['id'])->toArray();
        $servicesDetail = array();
        foreach ($services as $index => $service_id) {
            $serviceDetail = Businessservices::find($service_id['id']);
            $servicesDetail[$index]['id'] = $serviceDetail->id;
            $servicesDetail[$index]['title'] = $serviceDetail->title;
            $servicesDetail[$index]['des'] = $serviceDetail->desc;
            $servicesDetail[$index]['price'] = $serviceDetail->price;
        }
        $bookDetail = array(
            "customer_id" => base64_encode($obj_customer['id']),
            "customer_info" => $obj_customer,
            "starting_time" => $user['start_date'],
            "sevrice_provider" => $obj_sp[0],
            "booked_services" => $servicesDetail
        );
        $this->dispatch((new StylerZoneEmails($bookDetail, 'emails.booking.services_booking_customer')));
        //        Mail::send('emails.booking.services_booking_customer', $bookDetail, function ($message) use ($bookDetail) {
        //            $message->to($bookDetail['customer_info']['email'], $bookDetail['customer_info']['name'])->subject(' Booking Confirmation');
        //            $message->from('kinectro.development@gmail.com', 'StylerZone');
        //        });
        $this->dispatch((new StylerZoneEmails($bookDetail, 'emails.booking.services_booking_sp')));
        //        Mail::send('emails.booking.services_booking_sp', $bookDetail, function ($message) use ($bookDetail) {
        //            $message->to($bookDetail["sevrice_provider"]['business_email'], $bookDetail["sevrice_provider"]['business_name'])->subject('Booking Confirmation');
        //            $message->from('kinectro.development@gmail.com', 'StylerZone');
        //        });
    }

    public function bookingUpload(Request $request)
    {
        $data = $request->all();
        $ub = \App\Models\UserBusiness\UserBusiness::where('user_id', $data['user_id'])->first();
        $bookingFile = [];
        foreach ($data['files'] as $file) {
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(
                public_path() . '/assets/booking/',
                $fileName
            );
            $obj['name'] = $fileName;
            $obj['status'] = 0;
            array_push($bookingFile, $obj);
        }
        if ($ub->booking_files === null) {
            $ub->booking_files = json_encode($bookingFile);
        } else {
            $prev = json_decode($ub->booking_files, true);
            $ub->booking_files = json_encode(array_merge($bookingFile, $prev));
        }
        $ub->update();
        return response('200');
    }

    public function bookingUploadresponse(Request $request)
    {
        return response('200');
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
            //                        print_r($customers);
            //                        exit;
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
}
