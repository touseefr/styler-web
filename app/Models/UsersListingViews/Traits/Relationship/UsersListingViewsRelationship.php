<?php namespace App\Models\UsersListingViews\Traits\Relationship;
use App\Models\UsersListingViews\UsersListingViews;
use App\Models\Listing\Listing;

/**
 * Class UsersListingViewsRelationship
 * @package App\Models\UsersListingViews\Traits\Relationship
 */
trait UsersListingViewsRelationship {

    /** Each user has one info record
		* @return mixed
		*/
	public function viewslisting(){
		return $this->belongsTo(Listing::class,'id');
    } 
		
}