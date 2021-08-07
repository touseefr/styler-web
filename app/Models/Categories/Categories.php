<?php

namespace App\Models\Categories;

use App\Models\Categories\Traits\Attribute\CategoriesAttribute;
use App\Models\Categories\Traits\Relationship\CategoriesRelationship;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Blog\Blog;

/**
 * Class Categories
 * @package App\Models\Categories
 */
class Categories extends Model {

    use SoftDeletes,
        CategoriesAttribute,
        CategoriesRelationship;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'categories';

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

    public function scopeOfType($query, $type) {
        return $type ? $query->where('type_code', $type) : $query;
    }

    public function scopeChildren($query, $parent) {
        return $parent ? $query->where('parent', $parent) : $query->where('parent', null);
    }

    public function categoriespostcount() {
        return $this->hasMany(Blog::class, 'category_id')->count();
    }

}
