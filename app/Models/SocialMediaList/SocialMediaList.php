<?php namespace App\Models\SocialMediaList;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SocialMediaList
 * @package App\Models\SocialMediaList
 */
class SocialMediaList extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'social_medias_list';

	/**
	 * The attributes that are not mass assignable.
	 *
	 * @var array
	 */
	protected $guarded = ['id'];
}
