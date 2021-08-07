<?php

namespace App\Models\UserMeta;

use Illuminate\Database\Eloquent\Model;

class UserMeta extends Model
{
    protected  $table="user_meta";
    
    
    protected $fillable = ['user_id','key','value','type'];
    
}
