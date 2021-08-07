<?php

namespace App\Models\Coupon;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ManageCoupon extends Model
{
   use SoftDeletes;
   protected $table = 'manage_coupon';
   protected $fillable = [
        'coupon_id',
        'coupon_name',
        'coupon_type',
        'coupon_description',       
    ];
}
