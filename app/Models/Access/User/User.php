<?php namespace App\Models\Access\User;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use App\Models\Access\User\Traits\UserAccess;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Models\Access\User\Traits\Attribute\UserAttribute;
use App\Models\Access\User\Traits\Relationship\UserRelationship;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

/**
 * Class User
 * @package App\Models\Access\User
 */
class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

	use Authenticatable,
		CanResetPassword,
		SoftDeletes,
		UserAccess,
		UserRelationship,
		UserAttribute;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';
        
        
        protected $fillable=['name','password','confirmation_code','confirmed','hear_us','sub_newletter','other_option','promo_code'];

        /**
	 * The attributes that are not mass assignable.
	 *
	 * @var array
	 */
	protected $guarded = ['id'];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['password', 'remember_token'];

	/**
	 * For soft deletes
	 *
	 * @var array
	 */
	protected $dates = ['deleted_at'];

	/**
	 * @return mixed
	 */
	public function canChangeEmail() {
		return config('access.users.change_email');
	}
	
	/** user Id
	 * @return mixed
	 */
	public function scopeOfId($query, $id) {
		return $query = $query->where('id','=',$id);
	}
	/** check keyword searhed
	 * @return mixed
	 */
	public function scopeOfKeyword($query, $input) {
		

		if(isset($input['q']) && trim($input['q'])!=''){
			$query->where('status','=',1)
				  ->where(function($query) use ($input){
				  	$query->where('name','like',"%{$input['q']}%");
				  	$query->orWhere('email','like',"%{$input['q']}%");
				  });
		}

		return $query;
		
	}
	
	/** check keyword searhed
	 * @return mixed
	 */
	public function scopeOfBusinessKeyword($query, $input) {
		if(isset($input['q']) && trim($input['q'])!=''){
				$query->whereHas('listing', function ($q) use ($input) {
					$q->where('listing.title','like',"%{$input['q']}%");
			});
		}
		return $query;
	}

	/** check roles
	 * @return mixed
	 */
	public function scopeOfRoles($query,$role) {
		return $query->whereHas('roles', function ($q) use ($role) {
				$q->where('roles.name', $role);
		});
	}

	/** check roles
	 * @return mixed
	 */
	public function scopeOfRolesin($query,$roles) {
		return $query->whereHas('roles', function ($q) use ($roles) {
				$q->whereIn('roles.name', $roles);
		});
	}
	
	/** check suburb ans state
	 * @return mixed
	 */
	
       public function scopeOfLocation($query, $input) {
		if ((isset($input['post']) && trim($input['post']) !='' )|| (isset($input['state']) && trim($input['state']) !='')){
			return $query->whereHas('UserInfo.userSuburb', function ($q) use ($input) {
	     	if (isset($input['post']) && trim($input['post']) != '') {
				$q->where('suburb',$input['post']);
			}
			if (isset($input['state']) && trim($input['state']) != '') {
				$q->where('state', 'like', "%{$input['state']}%");
			}
	 	});
		}else{
			return $query;
		}
	}
	
	/** check rating
	 * @return mixed
	 */
	public function scopeOfRating($query, $to) {
		return  $query->whereHas('ReviewTo', function ($q) use ($to) {
	    $q->where('to_user_id', $to)
	     	->where('rating','>','0');
	 	});
    }


    /** check roles
	 * @return mixed
	 */
	public function scopeOfJobPrefrence($query,$id) {
		return $query->whereHas('jobPrefrences', function ($q) use ($id) {
				$q->where('job_prefrences.listing_id', $id);
		});
	}

	 /** check roles
	 * @return mixed
	 */
	public function scopeOfjobApplied($query,$id) {
		return $query->whereHas('jobApplied', function ($q) use ($id) {
				$q->where('job_applied.listing_id', $id);
		});
	}


	/** check roles
	 * @return mixed
	 */
	public function scopeOfwatchList($query,$id) {
		return $query->whereHas('userWatchlist', function ($q) use ($id) {
				$q->where('watch_list.item_id', $id);
		});
	}
	
}
