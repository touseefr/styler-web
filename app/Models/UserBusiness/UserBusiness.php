<?php namespace App\Models\UserBusiness;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserBusiness\Traits\Relationship\UserBusinessRelationship;

/**
 * Class UserBusiness
 * @package App\Models\UserBusiness
 */
class UserBusiness extends Model {

	use UserBusinessRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user_business';

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

	/**
	 * For soft deletes
	 *
	 * @var array
	 */
	protected $dates = ['deleted_at'];

}
