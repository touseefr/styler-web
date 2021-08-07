<?php namespace App\Models\Schoolcolleges;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Schoolcolleges\Traits\Attribute\SchoolcollegesAttribute;
use App\Models\Schoolcolleges\Traits\Relationship\SchoolcollegesRelationship;

/**
 * Class Schoolcolleges
 * @package App\Models\Schoolcolleges
 */
class Schoolcolleges extends Model {

	use SoftDeletes,
	SchoolcollegesAttribute,
	SchoolcollegesRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'listing';

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

	/**
	 * For listing of type scholls and collages
	 *
	 * @var array
	 */
	public function scopeOfType($query) {
		$arr = array('school','college');
		return $query = $query->whereIn('type',$arr);
	}

}
