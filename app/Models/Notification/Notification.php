<?php 
namespace App\Models\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Notification\Traits\Relationship\NotificationRelationship;

/**
 * Class Notification
 * @package App\Models\Notification
 */
class Notification extends Model {

	use SoftDeletes,
	NotificationRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'notifications';

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
	//protected $dates = ['deleted_at'];

}
