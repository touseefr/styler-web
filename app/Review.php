<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Mail;
use DB;

class Review extends Model {

    protected $table = 'rating_reviews';
    protected $fillable = array('from_user_id', 'to_user_id', 'rating', 'review_comment', 'type', 'parent', 'status', 'approx_price');

    public static function getExcerpt($str, $startPos = 0, $maxLength = 100) {
        if (strlen($str) > $maxLength) {
            $excerpt = substr($str, $startPos, $maxLength - 3);
            $lastSpace = strrpos($excerpt, ' ');
            $excerpt = substr($excerpt, 0, $lastSpace);
            $excerpt .= '[...]';
        } else {
            $excerpt = $str;
        }

        return $excerpt;
    }

    public static function get_reply_comment($comment_id) {

        return DB::table('rating_reviews')->where(['type' => '1', 'parent' => $comment_id])->get();
    }

    public static function update_review_status($rw_id, $status) {
        $review = Review::find($rw_id);

        if ($review->id) {
            $review->status = $status;
            $review->save();

            /*
             * * Send notification to the review receiver
             */

            $to_user = User::find($review->to_user_id);
            $from_user = User::find($review->from_user_id);

            //$datas = array('NAME' => auth()->user()->name, 'CONFIRM_LINK' => $confirm_link, 'RATING' => $input['rate'], 'REVIEW' => $input['review'], 'APPROXIMATE_PRICE' => $input['approx_price'], 'EMAIL' => $to_user->email);

            $datas = array('FROM_NAME' => $from_user->name, 'TO_NAME' => $to_user->name, 'RATING' => $review->rating, 'REVIEW' => $review->review_comment, 'APPROXIMATE_PRICE' => $review->approx_price, 'RECEIVER_EMAIL' => $to_user->email);

            Mail::send('emails.review_received', $datas, function($message) use ($datas) {
                $subject = getenv('REVIEW_RECEIVED');

                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));

                $message->to('hitesh.iquincesoft@gmail.com')->subject($subject);
            });


            return true;
        } else {
            return false;
        }
    }

    public static function reviewWithreply($comment_id) {
        $review = DB::table('rating_reviews')->limit(1)->select('id', 'review_comment as reply_content', DB::raw('(SELECT ur.name FROM users AS ur WHERE ur.id=from_user_id ) AS to_name,(SELECT CONCAT(assets.path,assets.name) FROM users AS ur LEFT JOIN assets ON assets.id=ur.profile_pic  WHERE ur.id=from_user_id) as image_path'))
                ->where('parent', $comment_id)                
                ->get();
        return $review;
    }

}
