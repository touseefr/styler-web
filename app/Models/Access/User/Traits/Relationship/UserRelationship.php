<?php

namespace App\Models\Access\User\Traits\Relationship;

use App\Models\Access\User\UserProvider;
use App\Models\UserAppointments\UserAppointments;
use App\Models\UserInfo\UserInfo;
use App\Models\UserBusiness\UserBusiness;
use App\Models\UserSubscription\UserSubscription;
use App\Models\UserPaymentInfo\UserPaymentInfo;
use App\Models\Listing\Listing;
use App\Models\Assets\Assets;
use App\Models\Reviews\Reviews;
use App\Models\UserSocialAccounts\UserSocialAccounts;
use DB;

/**
 * Class UserRelationship
 * @package App\Models\Access\User\Traits\Relationship
 */
trait UserRelationship {

    /**
     * Many-to-Many relations with Role.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles() {
        return $this->belongsToMany(config('access.role'), config('access.assigned_roles_table'), 'user_id', 'role_id');
    }

    /**
     * Many-to-Many relations with Permission.
     * ONLY GETS PERMISSIONS ARE NOT ASSOCIATED WITH A ROLE
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions() {
        return $this->belongsToMany(config('access.permission'), config('access.permission_user_table'), 'user_id', 'permission_id');
    }

    /**
     * @return mixed
     */
    public function providers() {
        return $this->hasMany(UserProvider::class);
    }

    /**
     * @return mixed
     */
    public function listing() {
        return $this->hasMany(Listing::class, 'user_id');
    }

    /** Each user has multi appointments
     * @return mixed
     */
    public function userAppointment() {
        return $this->hasMany(UserAppointments::class, 'user_id');
    }

    /** Each service provider has multi appointments
     * @return mixed
     */
    public function serviceproviderAppointment() {
        return $this->hasMany(UserAppointments::class, 'service_provider_id');
    }

    /** Each User has multi payment methods
     * @return mixed
     */
    public function userPaymentInfo() {
        return $this->hasMany(UserPaymentInfo::class, 'user_id');
    }

    /** Each user has one infromation record
     * @return mixed
     */
    public function userInfo() {
        return $this->hasOne(UserInfo::class, 'user_id');
    }

    /** Each user submit multiple reviews
     * @return mixed
     */
    public function ReviewFrom() {

        return $this->hasMany(Reviews::class, 'from_user_id');
    }

    /** Each user has multiple reviews
     * @return mixed
     */
    public function ReviewTo() {
        return $this->hasMany(Reviews::class, 'to_user_id')->where('status','1');
    }

    /** Each User has One Businesses
     * @return mixed
     */
    public function UserBusiness() {
        return $this->hasOne(UserBusiness::class, 'user_id');
    }

    /** Each User has multiple social accounts
     * @return mixed
     */
    public function UserSocialAccounts() {
        return $this->hasMany(UserSocialAccounts::class, 'user_id');
    }

    /** Each job can preferred by multiple candidates
     * @return mixed
     */
    public function jobPrefrences() {
        return $this->belongsToMany(Listing::class, 'job_prefrences', 'user_id', 'listing_id');
    }

    /** Each job can shortlisted by many users
     * @return mixed
     */
    public function jobShortlist() {
        return $this->belongsToMany(Listing::class, 'job_shortlisted', 'user_id', 'listing_id');
    }

    /** Each job has multiple candidates
     * @return mixed
     */
    public function jobApplied() {
        return $this->belongsToMany(Listing::class, 'job_applied', 'user_id', 'listing_id');
    }

    /** Each user has profile image
     * @return mixed
     */
    public function profilepic() {
        return $this->belongsTo(Assets::class, 'profile_pic');
    }

    /** Each user has video
     * @return mixed
     */
    public function profilevideo() {
        return $this->belongsTo(Assets::class, 'video');
    }

    /** Each job can shortlisted by many users
     * @return mixed
     */
    public function userWatchlist() {
        return $this->belongsToMany(Listing::class, 'watch_list', 'user_id', 'item_id', 'id');
    }

    /** Each User has One Businesses
     * @return mixed
     */
    public function UserSubscription() {
        return $this->hasMany(UserSubscription::class, 'user_id');
    }

    public function UserActiveSubscription() {
        $subscriptions = $this->hasMany(UserSubscription::class, 'user_id');
        $subscription = $subscriptions->where("plan_status", 1)->get()->first();
        return !empty($subscription) ? $subscription : (object) array("plan_id" => "1");
    }

    public function BusinessBrands() {
        return $this->hasMany(\App\BusinessBrand::class, 'author');
    }

    public function Employee() {
        return $this->hasMany(\App\Employee::class, 'parent_id')->where('delete_flag','0');
    }

    public function Booking() {
        return $this->hasMany(\App\Booking::class, 'user_id');
    }

    public function UserMeta() {
        return $this->hasMany(\App\Models\UserMeta\UserMeta::class, 'user_id');
    }

    public function userMetaCoverletter() {
        $coverletter_info = $this->UserMeta()->where('key', 'coverletter_resume')->get()->toArray();
        $return = array();
        if ($coverletter_info) {
            $return = unserialize($coverletter_info[0]['value']);
        }
        return $return;
    }

    public function scCourses() {
        return $this->hasMany(\App\Models\BusinessCourses\BusinessCourses::class, 'user_id');
    }
    public function profileResume($user){
        return Assets::find($user);
    }

    
    public function spServices(){
        return $this->hasMany(\App\Businessservices::class,'author');    
    }
    public function spDeals(){
        return $this->hasMany(Listing::class,'user_id')->where('type','deal')->where('expiry','>', date('Y-m-d'));    
    }    
}
