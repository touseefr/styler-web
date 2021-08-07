<?php

namespace App\Models\SmsPackage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\SmsPackage\Traits\Relationship\SmsPackageRelationship;
class SmsPackage extends Model
{
    use SoftDeletes,SmsPackageRelationship;
    protected $table = 'sms_packages';
    protected $fillable = array('name', 'description','limit','price','status');
    /**
	 * For soft deletes
	 *
	 * @var array
	 */
	protected $dates = ['deleted_at'];
        
   
}
