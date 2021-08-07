<?php

namespace App\Models\ListingPackage;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ListingPackage\Traits\Relationship\ListingPackageRelationship;
class ListingPackage extends Model
{
    use SoftDeletes,ListingPackageRelationship;
    protected $table = 'listing_packages';
    protected $fillable = array('name', 'description','limit','price','status');
    /**
	 * For soft deletes
	 *
	 * @var array
	 */
	protected $dates = ['deleted_at'];
}
