<?php namespace App\Models\Locations\Traits\Relationship;
use App\Models\Locations\Locations;
use App\Models\Listing\Listing;
use App\Models\UserBusiness\UserBusiness;
use App\Models\UserInfo\UserInfo;
/**
 * Class ServiceRelationship
 * @package App\Models\Assets\Traits\Relationship
 */
trait LocationsRelationship {

		/** Each Lisitng has locations
		 * @return mixed
		*/
		public function listing() {
       
 			return $this->belongsToMany(Listing::class, 'listing_location', 'location_id', 'listing_id');
        } 
		
		/** Each User has locations
		 * @return mixed
		*/
		public function userInfo() {
			return $this->hasOne(UserInfo::class,'suburb');
 		}
		
		/** Each User has locations
		 * @return mixed
		*/
		public function businessSuburb() {
       
 			return $this->hasOne(UserInfo::class, 'suburb');
        }

		
}