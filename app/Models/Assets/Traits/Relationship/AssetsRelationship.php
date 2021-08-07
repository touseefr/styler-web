<?php namespace App\Models\Assets\Traits\Relationship;
use App\Models\Assets\Assets;
use App\Models\Schoolcolleges\Schoolcolleges;
use App\Models\Listing\Listing;
use App\Models\Access\User\User;
/**
 * Class ServiceRelationship
 * @package App\Models\Assets\Traits\Relationship
 */
trait AssetsRelationship {

     /** Each school or college has multi images
     * @return mixed
    */
    	public function schoolcolleges() {
       
 			return $this->belongsToMany(Schoolcolleges::class, 'schools_colleges_images', 'asset_id', 'schools_colleges_id');
        }  
		
		
		/** Each classifieds has multi images
		* @return mixed
		*/
		public function listing() {
       
 			return $this->belongsToMany(Listing::class, 'listing_assets', 'asset_id', 'listing_id');
        }

        /** Each User has profile pic
		* @return mixed
		*/
		public function userPicture() {
       
 			return $this->hasOne(User::class, 'profile_pic');
        } 

        /** Each user has video
		* @return mixed
		*/
		public function userVideo() {
       
 			return $this->hasOne(User::class, 'video');
        }   


   
}