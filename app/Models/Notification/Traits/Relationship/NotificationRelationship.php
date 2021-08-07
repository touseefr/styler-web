<?php
namespace App\Models\Notification\Traits\Relationship;
use App\Models\Notification\Notification;
use App\Models\Access\User\User;
/**
 * Class NotificationRelationship
 * @package App\Models\Notification\Traits\Relationship
 */
trait NotificationRelationship {

		/** Each Notification has From User
		 * @return mixed
		*/
		/* public function UserFrom() {
			return $this->belongsTo(User::class,'from_user_id');
        }  */
		
		/** Each Notification has to User
		 * @return mixed
		*/
		/* public function UserTo() {
			return $this->belongsTo(User::class,'to_user_id');
        }  */

		
}