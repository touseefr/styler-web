<?php namespace App\Models\UserPaymentInfo;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserPaymentInfo\Traits\Relationship\UserPaymentInfoRelationship;

/**
 * Class UserPaymentInfo
 * @package App\Models\UserPaymentInfo
 */
class UserPaymentInfo extends Model {

	use UserPaymentInfoRelationship;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user_payment_info';

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
