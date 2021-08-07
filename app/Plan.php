<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model {

	protected $table = 'plans';
	protected $fillable = array('name', 'desc', 'price', 'currency', 'duration', 'features', 'discount', 'created_at');

	public static function get_feature_text($key){
		$features_texts = array('listing_per_month' => 'Amount of listings per month', 'images_count' => 'No. of images can be uploaded', 'videos_count' => 'No of videos can be uploaded', 'listing_types' => 'Type of listing to be added');
		return $features_texts[$key];
	}
	
	public static function get_category_text($key){
		$categories = array('deal' => 'Deals', 'businessforsale' => 'Business for Sale', 'schoolcolleges' => 'School & Colleges', 'gallery' => 'Gallery', 'serviceprovider' => 'Servie Provider', 'jobs' => 'Jobs', 'classified' => 'Classifieds');
		return $categories[$key];
	}
	
	public static function get_listing_types_text($key_array){
		foreach(@$key_array as $cat_key){
			$cats[] = Plan::get_category_text($cat_key);
		}
		return implode(',', $cats);
	}
}
