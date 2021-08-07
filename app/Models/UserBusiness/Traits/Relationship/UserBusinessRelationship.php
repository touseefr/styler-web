<?php namespace App\Models\UserBusiness\Traits\Relationship;
use App\Models\Categories\Categories;
use App\Models\UserBusiness\UserBusiness;
use App\Models\Access\User\User;
use App\Models\Locations\Locations;
/**
 * Class UserBusinessRelationship
 * @package App\Models\UserBusiness\Traits\Relationship
 */
trait UserBusinessRelationship {

    
		/** Each user has One businesses
		* @return mixed
		*/
		public function user() {
			return $this->belongsTo(User::class,'user_id');
        }

		
		/** Each user has one business suburb
		* @return mixed
		*/
		public function userBusinessSuburb() {
			return $this->belongsTo(Locations::class,'business_suburb');
		}

    public function categories() {
        return $this->belongsToMany(Categories::class, 'user_business_categories', 'business_id', 'category_id');
    }
}