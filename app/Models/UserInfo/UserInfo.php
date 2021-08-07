<?php namespace App\Models\UserInfo;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserInfo\Traits\Relationship\UserInfoRelationship;

/**
 * Class UserInfo
 * @package App\Models\UserInfo
 */
class UserInfo extends Model {

	use UserInfoRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user_info';

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
