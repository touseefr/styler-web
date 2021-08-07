<?php namespace App\Models\Assets;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Assets\Traits\Attribute\AssetsAttribute;
use App\Models\Assets\Traits\Relationship\AssetsRelationship;

/**
 * Class Schoolcolleges
 * @package App\Models\Schoolcolleges
 */
class Assets extends Model {

	use SoftDeletes,
	AssetsAttribute,
	AssetsRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'assets';

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


	public function scopeOfListing($query,$user) {
		return $query->whereHas('Listing', function ($q) use ($user) {
	     	$q->where('listing.user_id', '=', $user)
	     	  ->where('listing.status', '!=', 0);
	 	});
		
	}

}
