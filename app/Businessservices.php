<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;
class Businessservices extends Model {

	protected $table = 'businessservices';
	protected $fillable = array('id', 'title', 'price', 'discount', 'desc', 'created_at', 'updated_at');
	
	/* public static function get_catname_by_id($id){
		$cat = DB::select("select * from categories where id = {$id}");
		
		return $cat[0]->name;
	} */

}
