<?php namespace App\Models\Packages\Traits\Relationship;
use App\Models\Packages\Packages;
use App\Models\Access\User\User;
/**
 * Class PackagesRelationship
 * @package App\Models\UserInfo\Traits\Relationship
 */
trait PackagesRelationship {

		/** Each user has multiple packages
		* @return mixed
		*/
		public function userPaymentInfo() {
			return $this->hasMany(UserPaymentInfo::class,'package_id');
        } 
}