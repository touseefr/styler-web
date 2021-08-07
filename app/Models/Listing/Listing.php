<?php

namespace App\Models\Listing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Listing\Traits\Attribute\ListingAttribute;
use App\Models\Listing\Traits\Relationship\ListingRelationship;

/**
 * Class Services
 * @package App\Models\Services
 */
class Listing extends Model {

    use SoftDeletes,
        ListingAttribute,
        ListingRelationship;

    protected $fillable = [
        'contact',
        'is_show_phone',
        'title',
        'email',
        'description',
        'state',
        'latitude',
        'longitude',
        'status'
    ];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'listing';

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */

    /**
     * For soft deletes
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /** listing Id
     * @return mixed
     */
    public function scopeOfId($query, $id) {
        return $query = $query->where('id', '=', $id);
    }

    /** check keyword searhed
     * @return mixed
     */
    public function scopeOfKeyword($query, $input) {
        $query = $query->where('title', 'like', "%{$input['q']}%");
        if (isset($input['sortclassifieds'])) {
            $direction = ($input['sortclassifieds'] == 'hightolow') ? 'desc' : 'asc';
            $query->orderBy('price', $direction);
        }
        return $query;
    }
     public function scopeOfOrKeyword($query, $input) {
        $query = $query->orWhere('title', 'like', "%{$input['q']}%");
        if (isset($input['sortclassifieds'])) {
            $direction = ($input['sortclassifieds'] == 'hightolow') ? 'desc' : 'asc';
            $query->orderBy('price', $direction);
        }
        return $query;
    }
    public function scopeOfLocation($query, $input) {
        if (isset($input['zipcodes']) && count($input['zipcodes']) > 0) {
            $query->where('postcode', $input['zipcodes']);
            //echo "<pre>"; print_r( $input['zipcodes']); die;
//			return $query->whereHas('locations', function ($q) use ($input) {
//		     	$q->whereIn('postcode',$input['zipcodes']);
//			});
        } else {
            return $query;
        }
    }

    public function scopeOfLocation3($query, $input) {
        if (isset($input['statess'])) {
            $query->where('state', $input['statess']);
            //echo "<pre>"; print_r( $input['zipcodes']); die;
//			return $query->whereHas('locations', function ($q) use ($input) {
//		     	$q->where('state',$input['statess']);
//			});
        } elseif (isset($input['names'])) {
            $query->where('suburb', 'like', "%{$input['names']}%");
//			return $query->whereHas('locations', function ($q) use ($input) {
//		     	$q->where('name', 'like', "%{$input['names'][0]}%");
//			});
        } else {
            return $query;
        }
    }

    /*
     * * Custom Copy function of  scopeOfLocation(Hitesh)
     */

    public function scopeOfLocation2($query, $input) {
        if (isset($input['name'])) {
            $query->where('suburb', 'like', "%{$input['name']}%")
                    ->where('state', '=', "{$input['state']}")
                    ->where('postcode', '=', "{$input['postcode']}");

            //echo "<pre>"; print_r( $input['zipcodes']); die;
//			return $query->whereHas('locations', function ($q) use ($input) {
//		     	//$q->whereIn('name',$input['name']);
//				$q->where('name', 'like', "%{$input['name'][0]}%")
//				  ->where('state', '=', "{$input['state'][0]}")
//				  ->where('postcode', '=', "{$input['postcode'][0]}");
//			});
        } else {
            return $query;
        }
    }

    public function scopeOfSort($query, $state) {
        return $query->whereHas('locations', function ($q) use ($state) {
                    $q->where('state', 'like', "%{$state}%");
                });
    }

    public function scopeOfType($query, $type) {
        if ($type == 'schoolcolleges') {
            $arr = array('school', 'college');
        } else {
            $arr = array($type);
        }
        return $query = $query->whereIn('type', $arr);
    }

    public function scopeOfExpire($query) {
        return $query = $query->where('expiry', '>=', date('Y-m-d'));
    }

    public function scopeOfStatus($query) {
//		return $query = $query->where('listing.status','=',"'1'");
        return $query->whereRaw("listing.status = '1'");
    }

    public function scopeOfTypeIn($query, $types) {
        return $query = $query->whereIn('type', $types);
    }

    public function scopeOfIpaddress($query, $ipaddress) {
        return $query->whereHas('listingViews', function ($q) use ($ipaddress) {
                    $q->where('ipaddress', '=', "$ipaddress");
                });
    }

    public function scopeOfUserView($query, $user) {
        return $query->whereHas('listingViews', function ($q) use ($user) {
                    $q->where('user_id', '=', "$user");
                });
    }

    public function scopeOfCategory($query, $category){
        return $query->whereHas('Categories', function ($q) use ($category) {
                    $q->where('categories.id', '=', $category);
                });
    }
    public function scopeOfCategoryListing($query, $category){
        return $query->whereHas('Categories', function ($q) use ($category) {
                    $q->whereIn('categories.id', $category);
                });
    }
    

    public function scopeofUserRatingOrder($query, $order) {
        return $query->whereHas('User', function ($q) use ($order) {
                    if ($order == 1) {
                        $order = 'DESC';
                    } else {
                        $order = 'ASC';
                    }
                    $q->orderBy("users.rating", $order);
                });
    }

}
