<?php namespace App\Models\GalleryLikes;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SocialMediaList
 * @package App\Models\SocialMediaList
 */
class GalleryLikes extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'gallery_likes';

	/**
	 * The attributes that are not mass assignable.
	 *
	 * @var array
	 */
	protected $guarded = ['id'];
}
