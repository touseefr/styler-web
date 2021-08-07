<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Reviews\CreatereviewRequest;
use App\Models\Access\User\User as UserModel;
use App\Repositories\Frontend\Auth\AuthenticationContract;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Repositories\Frontend\User\UserContract;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Jobs\StylerZoneEmails;
use Settings;
use DB;
use User;
use Illuminate\Http\Request;
use App\Models\Reviews\Reviews;

/**
 * Class ReviewController
 * @package App\Http\Controllers\Frontend
 */
class ReviewController extends Controller {

    /**
     * [$reviews description]
     * @var [type]
     */
    function __construct(ReviewsContract $reviews, UserContract $user, AuthenticationContract $auth) {
        $this->reviews = $reviews;
        $this->user = $user;
        $this->auth = $auth;
    }

    /**
     * Get all reviews
     * @return Array jobs list
     */
    public function index() {
        $user_id = \Input::get('to_user');
        //$reviews = DB::table('rating_reviews')->where('from_user_id', '=', $user_id)->get();

        $reviews = \DB::table('rating_reviews')
                ->join('users', 'rating_reviews.to_user_id', '=', 'users.id')
                ->join('user_business', 'users.id', '=', 'user_business.user_id')
                ->select('rating_reviews.id', 'rating_reviews.to_user_id', 'rating_reviews.rating', 'users.name', 'users.profile_pic', 'rating_reviews.review_comment', 'rating_reviews.created_at', 'user_business.*')
                ->where('from_user_id', '=', $user_id)
                ->get();
        //print_r($reviews);

        $y = 0;
        foreach ($reviews as $review) {

            $users = $this->user->getUserDetail(Array('id' => $review->to_user_id));

            foreach ($users as $index => $user) {
                if (!empty($user->profilepic['name'])) {
                    $review->profile_pic = $user->profilepic['path'] . 'thumb_small_' . $user->profilepic['name'];
                }
            }
            $y++;
        }
        return response()->json($reviews, 200);
    }

    public function review_detail($id) {
        $is_api = \Input::get('is_api');

        $review = $this->reviews->getReviewDetail($id);

        if ($is_api) {

            return response()->json($review, 200);
        }

        return view('frontend.review.review_detail')->with('records', $review);
    }

    public function get_recieved_reviews() {

        $reviews = \DB::table('rating_reviews')->join('users', 'rating_reviews.to_user_id', '=', 'users.id')->select('rating_reviews.rating', 'users.name', 'users.profile_pic', 'rating_reviews.review_comment', 'rating_reviews.created_at')->where('to_user_id', '=', Auth::user()->id)->get();
        return view('frontend.review.recievedReview', ['data' => $reviews]);
    }

    public function UserReceivedReview() {
        $reviews = \DB::table('rating_reviews')->join('users', 'rating_reviews.from_user_id', '=', 'users.id')->select('rating_reviews.id', 'rating_reviews.from_user_id', 'rating_reviews.rating', 'rating_reviews.status', 'users.name', 'rating_reviews.review_comment', 'rating_reviews.created_at', 'rating_reviews.anonymously')->where('to_user_id', '=', Auth::user()->id)->get();
        $y = 0;               
        foreach ($reviews as $review) {
            $users = $this->user->getUserDetail(Array('id' => $review->from_user_id));
            foreach ($users as $index => $user) {
                if (!empty($user->profilepic['name'])) {
                    $review->profile_pic = $user->profilepic['path'] . 'thumb_small_' . $user->profilepic['name'];
                }
            }

            $y++;
        }

        return response()->json($reviews, 200);
    }

    public function reply_on_comment(Request $request) {
        try {

            extract($request->except('_token'));
            $data = array('from_user_id' => Auth::user()->id, 'to_user_id' => $to_user_id, 'rating' => '0.00', 'review_comment' => $reply_comment, 'type' => 1, 'parent' => $comment_id, 'status' => 1);

            if (!empty($reply_comment)) {
                // DB::table('rating_reviews')->insert($data);
                $r = new Reviews();
                $r->from_user_id = Auth::user()->id;
                $r->to_user_id = $to_user_id;
                $r->rating = '0.00';
                $r->review_comment = $reply_comment;
                $r->type = 1;
                $r->parent = $comment_id;
                $r->status = 1;
                $r->save();
            }

            $review = DB::table("rating_reviews")->select("rating_reviews.review_comment", "users.name", DB::raw("CONCAT(assets.path,assets.name) AS image_path"))
                    ->leftjoin("users", "users.id", "=", "rating_reviews.from_user_id")
                    ->leftjoin("assets", "assets.id", "=", "users.profile_pic")
                    ->where("parent", $comment_id)
                    ->get();
            return json_encode(array("success" => "200", "msg" => "Reply Successfully done.", "reviews" => json_encode($review)));
        } catch (Exception $e) {
            return json_encode(array("success" => "210", "msg" => $e->getMessage()));
        }
    }

    /**
     * create new reviews
     * params Array $params 
     * @return id 
     */
    public function save(CreatereviewRequest $request) {

        $input = $request->all();

        if ($input['from_user'] == 0) {
            $user = UserModel::where('email', $input['email'])->first();
            if (!$user) {

                $password = '123456';

                $data = [
                    'name' => $input['first_name'],
                    'email' => $input['email'],
                    'password' => $password
                ];

                $this->auth->create($data, array());
                $user = UserModel::where('email', $input['email'])->first();
                $youtube_link = '<a href="' . Settings::get('video') . '">' . Settings::get('video') . '</a>';
//                $datas = array('EMAIL' => $data['email'], 'NAME' => $data['name'], 'YOUTUBE_LINK' => $youtube_link,
//                        'search_page'=>getenv('APP_URL')."/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=",
//                "login_link"=>getenv('APP_URL')."/auth/login",
//                "unsubscribe_me"=>getenv('APP_URL')."/deactivateMe/". base64_encode($user->id)                        
//                        );
//
//                Mail::send('emails.welcome', $datas, function ($message) use ($datas) {
//                    $subject = getenv('WELCOME_EMAIL_SUBJECT');
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });
                // send password reset email
                $token = app('auth.password.broker')->createToken($user);

                $datas = array('token' => $token, 'EMAIL' => $input['email'], 'password' => $password);
                $this->dispatch((new StylerZoneEmails($datas, 'emails.password_generated')));
//                Mail::send('emails.password_generated', $datas, function ($message) use ($datas) {
//                    $subject = "Password reset";
//
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });
            }

            $input['from_user'] = $user->id;
            $input['name'] = $input['first_name'];
        } else {
            $input['from_user'] = auth()->user()->id;
            $input['name'] = auth()->user()->name;
            $input['email'] = auth()->user()->email;
        }

        $list = $this->reviews->create($input);
        return response()->json($list, 200);
    }

    /**
     * get reviews
     * params Array $params 
     * @return id 
     */
    public function get($id) {
        $reviews = $this->reviews->findOrThrowException($id);
        return response()->json($reviews, 200);
    }

    /**
     * update reviews
     * params Array $params 
     * @return id 
     */
    public function update($id, CreatereviewRequest $request) {
        if (!$id) {
            return response()->json([
                        'error' => [
                            'message' => 'Listing id does not exits'
                        ]
                            ], 422);
        }
        $list = $this->reviews->update($id, $request->all());
        return response()->json($list, 200);
    }

    /**
     * Request reviews
     * params Array $params 
     * @return id 
     */
    public function requestreview(CreatereviewRequest $request) {
        $user = $request->all();
        $message_data = array(
            "data" => ['customerName' => $user['customerName'], 'userId' => base64_encode(auth()->user()->id), 'name' => auth()->user()->name, 'BusinessName' => auth()->user()->userBusiness->business_name],
            "user" => $user
        );
        $this->dispatch((new StylerZoneEmails($message_data, 'emails.requestreview')));
//        return Mail::send('emails.requestreview',['customerName' => $user['customerName'], 'userId' => base64_encode(auth()->user()->id), 'name' => auth()->user()->name, 'BusinessName' => auth()->user()->userBusiness->business_name] , function ($message) use ($user) {
//                    $message->from('info@createyour.com.au', app_name());
//                    $message->to($user['customerEmail'], $user['customerEmail'])->subject(app_name() . ': Review Request!');
//                });

        return response()->json($request->all(), 200);
    }

    /**
     * delete reviews
     * params Array $params 
     * @return id 
     */
    public function delete($id) {
        if (!$id) {
            return response()->json([
                        'error' => [
                            'message' => 'reviews id does not exits'
                        ]
                            ], 422);
        }
        $review = $this->reviews->delete($id);
        return response()->json($review, 200);
    }

    public function getLatestReviews(Request $request) {
        $limit = 6;
        $pre_pg = ($request->has('pre_pg')) ? $request->input('pre_pg') : 0;
        $response = array();
        $reviewInfo = array();

        $user_id = ($request->has('user_id')) ? $request->input('user_id') : '';
        if ($user_id) {
            $userInfo = UserModel::find($user_id);
            $user_reviews = $userInfo->ReviewTo;
//            print_r($user_reviews);
//            exit;
            foreach ($user_reviews as $review) {
                $reviewInfo[] = array(
                    "review" => $review->toArray(),
                    "UserFrom" => $review->UserFrom->toArray(),
                    "roles" => $review->UserFrom->roles[0]->toArray(),
                    "userBusiness" => isset($review->UserFrom->userBusiness) ? $review->UserFrom->userBusiness->toArray() : '',
                    "profilepic" => $review->UserFrom->profilepic,
                );
            }

            (int) $no_of_pages = ceil(count($reviewInfo) / $limit);
            if ($pre_pg < $no_of_pages) {

                $array_chunks = array_chunk($reviewInfo, $limit);
                $response = array(
                    "reviews" => $array_chunks[$pre_pg],
                    "index_status" => (($pre_pg + 1) >= $no_of_pages) ? 0 : 1
                );
            } else {
                $response = array(
                    "reviews" => array(),
                    "index_status" => 0
                );
            }
        }
        echo \GuzzleHttp\json_encode($response);
    }

    public function ReportFake(Request $request) {
        if ($request->has('data') && $request->has('fakedetail')) {
            $review_data = $request->input('data');
            $fake_Detail = $request->input('fakedetail');
            $objReview = Reviews::find($review_data['id']);
            $objReview->fake_detail = $fake_Detail;
            $objReview->status = 4;
            $objReview->save();
            $admin = UserModel::find('1');
            $email_data = array(
                "user_from" => $objReview->UserFrom->toArray(),
                "user_to" => $objReview->UserTo->toArray(),
                "fake_detail" => $fake_Detail,
                "admin" => $admin->toArray()
            );
            $this->dispatch((new StylerZoneEmails($email_data, 'emails.reportfake')));
//            Mail::send('emails.reportfake', $email_data, function ($message) use ($email_data) {
//                $subject = "Fake Review Reported";
//                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//                $message->to($email_data['admin']['email'])->subject($subject);
//            });
            return \GuzzleHttp\json_encode(array('status' => "200", "msg" => "Successfully update."));
        } else {
            return \GuzzleHttp\json_encode(array('status' => "210", "msg" => "Report detail required."));
        }
    }

}
