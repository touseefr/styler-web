<?php namespace App\Models\UserSocialAccounts;

use Illuminate\Database\Eloquent\Model;

/**
 * Class UserSocialAccounts
 * @package App\Models\UserSocialAccounts
 */
class UserSocialAccounts extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user_social_accounts';

	/**
	 * The attributes that are not mass assignable.
	 *
	 * @var array
	 */
	protected $guarded = ['id'];
}
