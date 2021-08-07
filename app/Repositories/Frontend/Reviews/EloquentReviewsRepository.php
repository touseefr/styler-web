<?php

namespace App\Repositories\Frontend\Reviews;

use App\Http\Controllers\Controller;
use App\Exceptions\GeneralException;
use App\Models\Reviews\Reviews;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use App\Models\Access\User\User;
use App\Review;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Jobs\StylerZoneEmails;
use DB;

/**
 * Class EloquentReviewsRepository
 * @package App\Repositories\Assets
 */
class EloquentReviewsRepository extends Controller implements ReviewsContract {

    /**
     * [__construct description]
     * @author Mohan Singh <mslogicmaster@gmail.com>
     */
    public function __construct() {
        
    }

    /**
     * @param $id
     * @return mixed
     * @throws GeneralException
     */
    public function findOrThrowException($id) {
        $reviews = Reviews::withTrashed()->find($id);
        if (!is_null($reviews)) {
            return $reviews;
        }
        throw new GeneralException('That reviews does not exist.');
    }

    /**
     * @param $input
     * @param $roles
     * @param $permissions
     * @return bool
     * @throws GeneralException
     * @throws UserNeedsRolesException
     */
    public function create($input) {

        $from_user = $input['from_user'];

        $reviews = Reviews::with('UserFrom')
                ->where('to_user_id', $input['to_user'])
                ->where('from_user_id', $from_user)
                ->get();
        $bad_words = \DB::table('bad_words')
                ->select('bad_word')
                ->where(array('is_active' => 1))
                ->get();

        $has_bad_word = false;

        foreach ($bad_words as $bad_word) {
            if (strpos(strtolower($input['review']), strtolower($bad_word->bad_word)) !== false) {
                $has_bad_word = true;
                break;
            }
        }

        if (!count($reviews)) {
            $reviews = new Reviews();
            $reviews->from_user_id = $from_user;
            $reviews->to_user_id = $input['to_user'];
            $reviews->rating = $input['rate'];
            $reviews->review_comment = $input['review'];


            if (isset($input['approx_price'])) {
                $approx_price = $input['approx_price'];
                $reviews->approx_price = $approx_price;
            }

            if (isset($input['anonymously']) and $input['anonymously'] == 1) {
                $reviews->anonymously = 1;
            }

            if ($has_bad_word) {
                $reviews->status = 0;
            } else {
                $reviews->status = 1;
            }

            $reviews->save();

            if ($has_bad_word) {
                $to_user = getenv('ADMIN_EMAIL');

                $datas = array('id' => base64_encode($reviews->to_user_id), 'NAME' => $input['name'], 'RATING' => $input['rate'], 'REVIEW' => $input['review'], 'EMAIL' => $to_user);
                StylerZoneEmails::dispatch($datas, 'emails.review_bad_words');
//                $this->dispatch((new StylerZoneEmails($datas, 'emails.review_bad_words')));
//                Mail::send('emails.review_bad_words', $datas, function($message) use ($datas) {
//                    $subject = 'Uh-oh! We can’t post your review.';
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });
            } else {
                /*
                 * * Send confirmation email to the user
                 */
                $confirm_link = getenv('APP_URL') . "/profile?id=" . \GuzzleHttp\json_encode($reviews->to_user_id) . "&rw_id=" . $reviews->id . "&confirm=true";

                $to_user = User::find($input['to_user']);
                $from_user_info = User::find($from_user);

                $datas = array('id' => base64_encode($from_user_info->id), 'NAME' => $from_user_info->name, 'CONFIRM_LINK' => $confirm_link, 'RATING' => $input['rate'], 'REVIEW' => $input['review'], 'APPROXIMATE_PRICE' => $approx_price, 'EMAIL' => $from_user_info->email);
                StylerZoneEmails::dispatch($datas, 'emails.review_confirmation');
//                $this->dispatch((new StylerZoneEmails($datas, 'emails.review_confirmation')));

//                Mail::send('emails.review_confirmation', $datas, function($message) use ($datas) {
//                    $subject = "Your review matters";
//
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });

                $datas = array('id' => base64_encode($reviews->to_user_id), 'NAME' => $input['name'], 'CONFIRM_LINK' => $confirm_link, 'RATING' => $input['rate'], 'REVIEW' => $input['review'], 'APPROXIMATE_PRICE' => $approx_price, 'EMAIL' => $to_user->email);
                StylerZoneEmails::dispatch($datas, 'emails.review_confirmation_business');
//                $this->dispatch((new StylerZoneEmails($datas, 'emails.review_confirmation_business')));
//                Mail::send('emails.review_confirmation_business', $datas, function($message) use ($datas) {
//                    $subject = "Guess what? You’ve got a new fab review!";
//
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });
            }

            $userRatings = $this->userReviews($input['to_user']);
            $ratingCount = count($userRatings);
            $totalRating = 0;
            foreach ($userRatings as $key => $value) {
                $totalRating += $value['rating'];
            }
            $ratingAvg = $totalRating / $ratingCount;
            $ratingAvg = number_format($ratingAvg, 2);
            $user = User::find($input['to_user']);
            $user->rating = $ratingAvg;
            $user->save();
            return $reviews;
        } else {
            return array('status' => 'Already Review');
        }
        //throw new GeneralException('There was a problem creating this category. Please try again.');
    }

    /**
     * @param $id
     * @param $input
     * @return bool
     * @throws GeneralException
     */
    public function update($id, $input) {
        throw new GeneralException('There was a problem updating this Reviews. Please try again.');
    }

    /**
     * @param $id
     * @return boolean|null
     * @throws GeneralException
     */
    public function delete($id) {
        $reviews = $this->findOrThrowException($id, true);
        try {
            $reviews->forceDelete();
        } catch (\Exception $e) {
            throw new GeneralException($e->getMessage());
        }
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function restore($id) {
        $reviews = $this->findOrThrowException($id);

        if ($reviews->restore()) {
            return true;
        }

        throw new GeneralException("There was a problem restoring this reviews. Please try again.");
    }

    /**
     * @param integer $userId
     * @param string $order_by
     * @param string $sort
     * @return mixed
     */
    public function userReviews($userId, $order_by = 'id', $sort = 'asc') {

        return Reviews::with('UserFrom.ReviewTo')
                        ->with('UserFrom.roles')
                        ->with('UserFrom.profilepic')
                        ->where('to_user_id', $userId)
                        ->orderBy($order_by, $sort)
                        ->get();
    }

    public function getReviewDetail($id) {

        $review = Reviews::with('UserFrom.ReviewTo')
                ->with('UserFrom.roles')
                ->with('UserFrom.profilepic')
                ->where('id', $id)
                ->get();

        $replies = Reviews::with('UserFrom.ReviewTo')
                ->with('UserFrom.roles')
                ->with('UserFrom.profilepic')
                ->where('parent', $id)
                ->get();

        $review[0]->replies = $replies;

        return $review;
    }

    /**
     * save user rarting
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    function saveRating($inputs) {
        $review = Reviews::with('UserFrom')
                ->where('to_user_id', $inputs['to'])
                ->where('from_user_id', auth()->id())
                ->get();

        if (count($review)) {
            $reviews = $this->findOrThrowException($review[0]->id);
            $reviews->rating = $inputs['rate'];
            $reviews->save();
        } else {
            $reviews = new Reviews();
            $reviews->from_user_id = auth()->id();
            $reviews->to_user_id = $inputs['to'];
            $reviews->rating = $inputs['rate'];
            $reviews->review_comment = "";
            $reviews->save();
        }
    }

    /**
     * get user rarting
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    function getRating($id) {
        $review = Reviews::with('UserFrom')
                ->where('to_user_id', $id)
                ->get();
        return $review;
    }

    /**
     * get user rarting
     * @param $id
     * @return bool
     * @throws 
     */
    function getLatestReview($limit) {

        $reviews = Reviews::limit($limit)
                ->groupBy('id')
                ->orderBy('id', 'desc')
                ->whereIn('status', [1, 2])
                ->get();
        foreach ($reviews as $review) {
            $reply_comment = Reviews::select("rating_reviews.review_comment", "users.name", DB::raw("CONCAT(assets.path,assets.name) AS image_path"));
            $reply_comment->leftjoin("users", "users.id", "=", "rating_reviews.from_user_id");
            $reply_comment->leftjoin("assets", "assets.id", "=", "users.profile_pic");
            $reply_comment->where("parent", $review->id);
            $review->reply_comments = $reply_comment->get()->tojson();
        }
        return $reviews;
    }

    /** Request Review
     * @param $input
     * @return mixed
     */
    public function requestReview($inputs) {
        return Mail::send('emails.requestreview', ['profilelink' => $appointments->appointment_date], function ($message) use ($fromuser, $touser) {
                    $message->from($fromuser->email, app_name());
                    $message->to($touser->email, $touser->name)->subject(app_name() . ': Request For Review');
                });
    }

}
