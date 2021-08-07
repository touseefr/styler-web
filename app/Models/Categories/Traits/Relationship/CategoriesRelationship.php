<?php

namespace App\Models\Categories\Traits\Relationship;

use App\Models\Categories\Categories;
use App\Models\Listing\Listing;
use App\Models\Schoolcolleges\Schoolcolleges;
use App\Models\Blog\Blog;

/**
 * Class CategoriesRelationship
 * @package App\Models\Categories\Traits\Relationship
 */
trait CategoriesRelationship {

    /** Each schoolcolleges has many Categories
     * @return mixed
     */
    public function schoolcolleges() {
        return $this->belongsToMany(Schoolcolleges::class, 'schools_colleges_categories', 'category_id', 'schools_colleges_id');
    }

    /** A category has many childs
     * @return mixed
     */
    public function categories() {
        return $this->hasMany(Categories::class, 'parent');
    }

    /** A category has many childs
     * @return mixed
     */
    public function parentcategories() {
        return $this->belongsTo(Categories::class, 'parent');
//            return $this->belongsToMany(Categories::class, 'listing_categories', 'category_id', 'listing_id');
    }

    /** Each deals has many Categories
     * @return mixed
     */
    public function listing() {
        return $this->belongsToMany(Deals::class, 'listing_categories', 'category_id', 'listing_id');
    }

    

}
