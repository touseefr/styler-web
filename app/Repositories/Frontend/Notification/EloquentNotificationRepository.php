<?php

namespace App\Repositories\Frontend\Notification;

use App\Exceptions\GeneralException;
use App\Http\Controllers\Controller;
use App\Models\Notification\Notification;
use App\Repositories\Frontend\Notification\NotificationContract;
use App\Models\Access\User\User;
use App\Notifications;
use Mail;
use Auth;
use App\Jobs\StylerZoneEmails;
use Illuminate\Http\Request;
use App\Models\Listing\Listing;
use DB;

/**
 * Class EloquentNotificationRepository
 * @package App\Repositories\Assets
 */
class EloquentNotificationRepository extends Controller implements NotificationContract {

    public function findOrThrowException($id) {
        $notification = Notification::withTrashed()->find($id);
        if (!is_null($notification)) {
            return $notification;
        }
        throw new GeneralException('That notification does not exist.');
    }

    public function create($input) {
        if ($input) {
            $notification = new Notification();
            $notification->from_name = $input['from_name'];
            $notification->from_email = $input['from_email'];
            $notification->from_user_id = ( Auth::user() ? auth()->user()->id : 0 );
            $notification->message = $input['message'];
            $notification->to_email = $input['to_email'];
            $notification->to_user_id = $input['to_user_id'];
            $notification->list_id = $input['list_id'];
            $notification->created_at = date('Y-m-d h:i:s');
            $notification->deleted_at = "0000-00-00 00:00:00";
            $notification->save();
            $list_result = Listing::find($input['list_id']);
            $title = (!empty($list_result) ? $list_result->title : "");
            $data = array('name' => $input['from_name'], 'email' => $input['from_email'], 'message' => $input['message'], 'email_to' => $input['to_email'], 'title' => $title);
            StylerZoneEmails::dispatch($data, 'emails.notification_confirmation');
//            $this->dispatch((new StylerZoneEmails($data, 'emails.notification_confirmation')));
//			$result = Mail::send('emails.notification_confirmation', ['data'=>$data], function($message) use ($data){
//				//$subject = getenv('NOTIFICATION_CONFIRMATION');
//				$subject = 'NOTIFICATION CONFIRMATION | ' . $data['title'];
//				$message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM')); 
//				$message->to($data['email_to'])->subject($subject);
//			});
            return array('status' => 'Message sent to listing owner');
        } else {
            return array('status' => 'Already notify');
        }
    }

    public function getUserNotificatons() {
        //$notification = new Notification();
        /* return $notification::where('to_user_id',auth()->user()->id)
          ->join('listing', 'listing.id', '=', 'notifications.list_id')
          ->get(); */
        return DB::table('notifications')
                        ->join('listing', 'listing.id', '=', 'notifications.list_id')
                        ->select('notifications.*', 'listing.type')
                        ->where('notifications.to_user_id', auth()->user()->id)
                        ->get();
    }

}
