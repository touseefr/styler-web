<?php namespace App\Models\UserAppointments\Traits\Relationship;
use App\Models\UserAppointments\UserAppointments;
use App\Models\Access\User\User;
/**
 * Class UserprefrencesRelationship
 * @package App\Models\Userprefrences\Traits\Relationship
 */
trait UserAppointmentsRelationship {

    
		/** Each user has multi prefrences
		* @return mixed
		*/
		public function user() {
			return $this->belongsTo(User::class,'user_id');
        } 
		
		/** Each user has multi prefrences
		* @return mixed
		*/
		public function serviceprovider() {
			return $this->belongsTo(User::class,'service_provider_id');
        } 
}