<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Media extends Model {

	protected $table = 'medias';
	protected $fillable = array('file_name', 'mime_type', 'sizes', 'file_size');
	
	public static function image_sizes(){
		$sizes = array('small' => array('w' => 150, 'h' => 150), 'thumbnail' => array('w' => 350, 'h' => 350), 'medium' => array('w' => 600, 'h' => 600), 'large' => array('w' => 800, 'h' => 800));
		return $sizes;
	}
	
	/*
	** Media path
	*/
	
	public static function media_path(){
		return 'public/assets/site_img/';
	}
	
	/*
	** public media path
	*/
	
	public static function public_media_path(){
		return public_path().'/assets/site_img/';
	}
	
	/*
	** Delete Media
	*/
	
	public static function delete_media($id){
		$media = Media::find($id);
		if($media->id){
			$sizes = @unserialize($media->sizes);
			foreach(@$sizes as $key => $val){
				@unlink(base_path().'/'.$val);
			}
			if($media->delete()){
				return true;
			}
			else{
				return false;
			}
		}
	}
	
	/*
	** image in various sizes
	*/
	
	public static function get_media($id, $size){
		$media = Media::find($id);
		$sizes = @unserialize($media->sizes);
		return url().'/'.$sizes[$size];
	}

}
