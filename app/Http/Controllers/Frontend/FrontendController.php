<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\UserBusiness\UserBusiness;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use App\Repositories\Frontend\User\UserContract;
use Illuminate\Http\Request;
use App\Team;
use App\Plan;
use App\User;
use App\Transaction;
use Auth;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Input;
use App\Models\UserSubscription\UserSubscription;
use Stripe;
use Stripe\Customer;
use Stripe\Charge;
use Config;
use DrewM\MailChimp\MailChimp;

/**
 * Class FrontendController
 * @package App\Http\Controllers
 */
class FrontendController extends Controller {

    /**
     * [__construct description]
     * @author Mohan Singh <mslogicmaster@gmail.com>
     */
    public function __construct(ReviewsContract $review, AssetsContract $assets, UserContract $user) {
        $this->review = $review;
        $this->assets = $assets;
        $this->user = $user;
    }

    /**
     * @return \Illuminate\View\View
     */
    public function index() {
        if (Auth::check()) {

            $location='';
            if(Auth::user()->roles[0]->name=='ServiceProvider' || Auth::user()->roles[0]->name=='Distributor' || Auth::user()->roles[0]->name=='SchoolCollege'){
                $location=Auth::user()->UserBusiness->business_suburb .','.Auth::user()->UserBusiness->state .','.Auth::user()->UserBusiness->postcode;
            }else{
                if(isset(Auth::user()->userInfo->suburb) || isset(Auth::user()->userInfo->state) || isset(Auth::user()->userInfo->postcode)){
                    $location=Auth::user()->userInfo->suburb .','.Auth::user()->userInfo->state .','.Auth::user()->userInfo->postcode;
                }
            }
            return redirect('search?q=&label=Service+Provider&searchFor=serviceprovider&location_address='.$location);
        }
        $all_business = DB::table('user_business')->where('latitude', '<>', '', 'and')->where('longitude', '<>', '', 'and')->join('users', 'users.id', '=', 'user_business.user_id')->get();
        $gallery = $this->getgallery();
        $recent_members = $this->user->getRecentMembers();
        $per_page = 10;
        $latestReview = $this->review->getLatestReview($per_page);
        $topbusiness = DB::select("SELECT users.id,users.rating,user_business.business_name,user_business.state,user_business.business_suburb,user_business.about,(SELECT COUNT(rating_reviews.id) FROM rating_reviews WHERE rating_reviews.from_user_id=users.id OR rating_reviews.to_user_id=users.id) AS 'total_reviews' FROM users inner join user_business on user_business.user_id=users.id and users.status!=0 ORDER BY users.rating DESC limit 3");
        $categories= \App\Models\Categories\Categories::where('type_code','service')->where('id', '!=', '1')->groupBy('categories.name')->get()->toArray();
        $categories= \GuzzleHttp\json_encode($categories);
        return view('frontend.home')
                        ->withCategories($categories)
                        ->withLatestreviews($latestReview)
                        ->withAllbusiness($all_business)
                        ->withGallery($gallery)
                        ->withRecentmembers($recent_members)->withbusiness($topbusiness);
    }

    function getgallery() {
        $count = 0;
        $user_meta = \DB::table('user_meta')->where(array('key' => 'usergallery'))->get();
        $images_info = array();
        $categories = array();

        $logged_in_user_id = 0;

        if (!empty($user_meta)) {
            if (Auth::check()) {
                $logged_in_user_id = Auth::User()->id;
            }

            foreach ($user_meta as $meta) {
                $user_id = $meta->user_id;

                $user_business = DB::table('user_business')->where(array('user_id' => $user_id))->get()->first();

                if (empty($user_business)) {
                    continue;
                }

//                $user_business = current($user_business);
//                print_r($user_business);
                $assets_ids = unserialize($meta->value);
                foreach ($assets_ids as $cat_id => $catimages) {
                    $cate_id = $cat_id;
                    $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();
                    if (!array_key_exists($cate_id, $categories)) {
                        $categories[$cate_id] = $cate_info[0];
                    }

                    foreach ($catimages as $imgid => $imagtitle) {
                        $image_id = $imgid;
                        $image_title = $imagtitle['title'];
                        if (!empty($image_id)) {
                            $assets = \DB::table('assets')->where(array('id' => $image_id))->get();

                            $gallery_likes = \DB::table('gallery_likes')->where(array('asset_id' => $image_id))->get();
                            foreach ($assets as $asset) {

                                if (count($images_info) > 40) {
                                    break;
                                }

                                $images_info[] = array(
                                    'asset_id' => $asset->id,
                                    'image_name' => 'thumb_medium_' . $asset->name,
                                    'image_org' => $asset->name,
                                    'image_path' => $asset->path,
                                    'image_title' => $image_title,
                                    'image_cat' => $cate_info[0]->name,
                                    'cat_id' => $cate_id,
                                    'user_id' => $user_id,
                                    'likes_count' => count($gallery_likes),
                                    'business' => array(
                                        'id' => (isset($user_business->id)) ? $user_business->id : '',
                                        'business_name' => (isset($user_business->business_name)) ? $user_business->business_name : ''
                                    )
                                );

                                $count++;
                            }
                        }
                    }
                }
            }
        }

        return array('categories' => $categories, 'images' => $images_info);
    }

    /**
     * @return \Illuminate\View\View
     */
    public function macros() {
        $response = [
            'code' => 200,
            'status' => 'succcess',
            'data' => ['dsds' => 'dsdsd'],
        ];
        return response()->json($response, $response['code']);
        //return view('frontend.macros');
    }

    public function team_single_page($id) {
        $team = Team::find($id);
        return view('frontend.team.single')->with(array('team' => $team));
    }

    /*
     * * Submit ask a question
     */

    public function submit_a_qn() {
        $question = Input::get('question');
        $current_user_name = Auth::user()->name;
        $current_user_email = Auth::user()->email;

        /*
         * * Send mail to admin
         */

        $datas = array('QUESTION' => $question, 'EMAIL' => $current_user_email, 'NAME' => $current_user_name);

        Mail::send('emails.ask-a-qn', $datas, function($messages) use ($datas) {
            $subject = getenv('LISTING_CREATED');
            //$messages->from($datas['EMAIL'], $datas['NAME']);
            $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));

            $messages->to(getenv('ADMIN_EMAIL'))->subject($subject);
        });
        echo 'Your question has been submitted successfully!';
    }

    /*
     * * Remove watchlist item
     */

    public function remove_watchlist_item() {
        /* $listing_id = Input::get('listing_id');
          $user_id = Auth::user()->id;
          $response = User::remove_watchlist_item($listing_id, $user_id);
          echo $response; */

        if (Input::get('watchtype')) {
            $watchtype = Input::get('watchtype');
        } else {
            $watchtype = 'listing';
        }
        $item_id = Input::get('item_id');
        $user_id = Auth::user()->id;
        $response = User::remove_watchlist_item($item_id, $user_id, $watchtype);
        echo $response;
    }

    public function posttest(Request $request) {
        echo "<pre>";
        print_r($request->all());
        $creditCardToken = $request->input('stripeToken');
        \Stripe\Stripe::setApiKey("sk_test_a8OklXGccmqdYl5fDRFlNWN7");

        $customer = \Stripe\Customer::create(array(
                    "description" => "Customer for jenny.rosen@example.com",
                    "email" => "test@test.com" // obtained with Stripe.js
        ));
        print_r($customer);
        exit;
    }

    public function login() {
        return view('frontend.login');
    }

    public function getBusinessInfo() {
        $userbusiness = UserBusiness::where('user_id', Auth::User()->id)->first();
        $userSubscription = Auth::user()->UserActiveSubscription();

        if ($userbusiness)
            return \GuzzleHttp\json_encode(array("status" => "200", "userbusiness" => $userbusiness, 'userSubscription' => (isset($userSubscription->stp_customer_id) ? $userSubscription->stp_customer_id : null)));
        else
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Record not exist"));
    }

    public function test(Request $request) {
        echo "i am here";
        echo 'sdas';
        $url = env('StylerBook_Url') . '/onlineBooking';
        print_r($url);
        $ch = curl_init();
        $fields = [
            'id' => 10
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
        print_r($rawBody);
        if ($rawBody != '200') {
            $message = 'Booking Not Found';
            if ($rawBody == 'Method Not Allowed') {
                $message = 'Method Not Allowed';
            }
            \DB::table("cronjob_errors")->insert(
                    ['user_id' => 22, 'type' => 2, 'error_message' => $message, 'created_at' => date('Y-m-d h:i:s'), 'updated_at' => date('Y-m-d h:i:s')]
            );
        }
//        echo "<br />---------------------------------------=i am here=---------------------------------------<br />";
        exit;
        \App\Jobs\SendReminderEmail::dispatch();
    }

    public function saveFbCredential(Request $request) {
        if ($request->has('facebook_app_id') && $request->has('facebook_page_id')) {
            UserBusiness::where('user_id', Auth::user()->id)->update($request->all());
            return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "FB Credential Successfully update"));
        } else {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Something went wrong please try again later."));
        }
    }
    public function fecZoho(){
            echo "<form action='https://crm.zoho.com/crm/Unsubscribe?encoding=UTF-8' method='POST' name='unsubForm' onSubmit='return emailValidate()' >   <input type='hidden' name='xnQsjsdp' value='f8f3f1611ef5923540d527940d137a830ba0e19794207360060f4344233cde42'/>  <input type='hidden' name='actionType' value='dW5zdWJzY3JpYmU='/>  <input type='hidden' name='returnURL' value='http://app.stylerzone.loc' /><table width='481' style='border:10px solid #f4f4f4;' cellpadding='0' cellspacing='0'><tr><td style='padding:10px 0px 10px 10px; font-family:sans-serif; font-size:13px;'><strong>Enter Your Email Address</strong> </td><td style='padding:10px 0px 10px 10px;'><input type='text' name='email' maxlength='120' style='width:190px;border:1px solid #c4d6e2; background-color:#fbfdff; font-family:sans-serif; font-size:13px;'/></td><td style='padding:10px 10px 10px 0px;'><input type='submit' style='background-color:#7a7e8a; color:#ffffff; font-weight:bold; font-family:sans-serif; font-size:11px; border:1px solid #616572;' value='Unsubscribe'/></td></tr></table>  <script>function emailValidate(){var email=document.forms['unsubForm']['email'].value;document.forms['unsubForm']['email'].value= email.trim();var atpos=email.indexOf('@');var dotpos=email.lastIndexOf('.');if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length){alert('Please enter a valid email address.');return false;}}</script></form>";
    }
    public function testAddress(Request $request){

        echo "<pre>";
        echo   $request->ip();
        $user_ip = $request->ip();
        echo $user_ip;
        $geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));
        print_r($geo);
        $country = $geo["geoplugin_countryName"];
        $city = $geo["geoplugin_city"];
        echo $country;
    }
}
