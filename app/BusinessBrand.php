<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BusinessBrand extends Model
{
     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'business_brand';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $fillable = ['title', 'price','dicount','brand_desc','author'];
    
    
    
    
    
    
    
    
}
