<?php

namespace App\Models\Booking;

use Illuminate\Database\Eloquent\Model;

class bookingdeal extends Model
{
   protected $table = 'deal_booking';   
   protected $fillable = ['listing_id','later_deal_token','status','deal_duation','user_id'];
      
}
