<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;
class Faq extends Model {

	protected $table = 'faqs';
	protected $fillable = array('question', 'answer', 'category_id');
	
	public static function get_catname_by_id($id){
		$cat = DB::select("select * from categories where id = {$id}");
		
		return $cat[0]->name;
	}

}
