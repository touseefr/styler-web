<?php namespace App\Models\Pages;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Pages\Traits\Attribute\PagesAttribute;
use App\Models\Pages\Traits\Relationship\PagesRelationship;

/**
 * Class Pages
 * @package App\Models\Pages
 */
class Pages extends Model {

	use SoftDeletes,
	PagesAttribute,
	PagesRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'pages';

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
