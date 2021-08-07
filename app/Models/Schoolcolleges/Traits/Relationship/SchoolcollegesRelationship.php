<?php namespace App\Models\Schoolcolleges\Traits\Relationship;
use App\Models\Schoolcolleges\Schoolcolleges;
use App\Models\Locations\Locations;
use App\Models\Assets\Assets;
use App\Models\Categories\Categories;
/**
 * Class ServiceRelationship
 * @package App\Models\Services\Traits\Relationship
 */
trait SchoolcollegesRelationship {

    /** Each school or college belogs to many categories
     * @return mixed
    */
    public function categories()
    {
        return $this->belongsToMany(Categories::class, 'listing_categories', 'listing_id', 'category_id');
    }

    /** Each school or college has one image
     * @return mixed
    */
    public function assets() {
        return $this->belongsToMany(Assets::class, 'listing_assets','listing_id', 'asset_id');
    }

    /** Each Lisitng has locations
     * @return mixed
     */
    public function locations() {

        return $this->belongsToMany(Locations::class, 'listing_location', 'listing_id', 'location_id');
    }
}