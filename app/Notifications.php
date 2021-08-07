<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Mail;
use DB;
class Notifications extends Model
{
	protected $table = 'notifications';
	protected $fillable = array('fromname', 'fromemail','message');
    //
}
