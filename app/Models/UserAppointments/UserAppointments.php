<?php namespace App\Models\UserAppointments;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserAppointments\Traits\Relationship\UserAppointmentsRelationship;

/**
 * Class UserAppointments
 * @package App\Models\UserAppointments
 */
class UserAppointments extends Model {

	use UserAppointmentsRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user_appointments';

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
