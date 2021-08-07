<?php

namespace App\Models\Listing\Traits\Relationship;

use App\Models\Assets\Assets;
use App\Models\Categories\Categories;
use App\Models\Listing\Listing;
use App\Models\ListingMeta\ListingMeta;
use App\Models\Locations\Locations;
use App\Models\Access\User\User;
use App\Models\UsersListingViews\UsersListingViews;

/**
 * Class DealsRelationship
 * @package App\Models\Listing\Traits\Relationship
 */
trait ListingRelationship {

    /** Each Listing belogs to many categories
     * @return mixed
     */
    public function categories() {
        return $this->belongsToMany(Categories::class, 'listing_categories', 'id', 'category_id');
//        return $this->belongsToMany(\App\Models\Listing\listingCategories::class, Categories::class, 'category_id', 'id');
    }
    public function classifiedCategories(){
        return $this->belongsToMany(Categories::class, 'listing_categories', 'listing_id', 'category_id');
    }
    public function listingCategories(){
        return $this->belongsToMany(Categories::class, 'listing_categories', 'listing_id', 'category_id');
    }
    /**
     * @return mixed
     */
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Each Listing has multi assets
     * @return mixed
     */
    public function assets() {
        return $this->belongsToMany(Assets::class, 'listing_assets', 'listing_id', 'asset_id');
    }

    /** Each Lisitng has locations
     * @return mixed
     */
    public function locations() {

        return $this->belongsToMany(Locations::class, 'listing_location', 'listing_id', 'location_id');
    }

    /** Each job can preferred by multiple candidates
     * @return mixed
     */
    public function userPrefrences() {
        return $this->belongsToMany(User::class, 'job_prefrences', 'listing_id', 'user_id');
    }

    /** Each job can shortlisted by many users
     * @return mixed
     */
    public function userShortlist() {
        return $this->belongsToMany(User::class, 'job_shortlisted', 'listing_id', 'user_id');
    }

    /** Each job has multiple candidates
     * @return mixed
     */
    public function userApplied() {
        return $this->belongsToMany(User::class, 'job_applied', 'listing_id', 'user_id');
    }

    /** Each job has many watch listing
     * @return mixed
     */
    public function listingWatch() {
        return $this->belongsToMany(User::class, 'watch_list', 'item_id', 'user_id', 'watchtype');
    }

    /** Each job has many views
     * @return mixed
     */
    public function listingViews() {
        return $this->hasMany(UsersListingViews::class, 'listing_id');
    }

    public function listingMeta() {
        return $this->hasMany(ListingMeta::class, 'listing_id');
    }

    public function listService() {
        return $this->hasMany(\App\Models\Dealservices\DealServices::class, 'deal_id');
    }

    public function JobsApplication() {
        return $this->hasMany(\App\Models\JobApplied\JobApplied::class, 'listing_id');
    }

    public function JobViews() {
        return $this->JobsApplication()->where("applic_status", 1);
    }

    public function ShortListed() {
        return $this->JobsApplication()->where("applic_status", 2);
    }

    public function JobInterview() {
        return $this->JobsApplication()->where("applic_status", 3);
    }
    public function JobCompleted() {
        return $this->JobsApplication()->where("applic_status", 5);
    }
    public function getAllCourses(){
        return $this->hasMany(\App\Models\BusinessCourses\BusinessCourses::class, 'user_id','user_id');
    }
    public function getListingCourses(){
        return $this->hasMany(\App\Models\ListingCourses\ListingCourses::class,'deal_id');        
    }
    public function getcoursesDetail(){
       
    }
    

}
