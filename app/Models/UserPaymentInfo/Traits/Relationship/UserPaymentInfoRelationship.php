<?php namespace App\Models\UserPaymentInfo\Traits\Relationship;
use App\Models\UserPaymentInfo\UserPaymentInfo;
use App\Models\Packages\Packages;
use App\Models\Access\User\User;
/**
 * Class UserPaymentInfoRelationship
 * @package App\Models\UserInfo\Traits\Relationship
 */
trait UserPaymentInfoRelationship {

    /** Each user has multiple payment methods
	* @return mixed
	*/
	public function user(){
		return $this->belongsTo(User::class,'user_id');
	} 
	
	/** Each user has multiple packages
	* @return mixed
	*/
	public function packages(){
		return $this->belongsTo(Packages::class,'package_id');
	} 
}