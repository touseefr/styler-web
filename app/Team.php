<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model {

	protected $table = 'team_members';
	protected $fillable = array('owner_id', 'member_name', 'image_id', 'designation', 'about');

}
