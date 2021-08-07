<?php

namespace App\Models\Reviews;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Reviews\Traits\Relationship\ReviewsRelationship;

/**
 * Class Reviews
 * @package App\Models\Reviews
 */
class Reviews extends Model {

    use SoftDeletes,
        ReviewsRelationship;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'rating_reviews';

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

  

}
