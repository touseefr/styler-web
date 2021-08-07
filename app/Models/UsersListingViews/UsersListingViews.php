<?php namespace App\Models\UsersListingViews;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\UsersListingViews\Traits\Relationship\UsersListingViewsRelationship;

/**
 * Class Reviews
 * @package App\Models\Reviews
 */
class UsersListingViews extends Model {

	use SoftDeletes,
	UsersListingViewsRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users_listing_views';

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
