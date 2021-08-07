<?php

namespace App\Models\ListingCourses;

use Illuminate\Database\Eloquent\Model;

class ListingCourses extends Model
{
   protected $table = "listing_courses";
    protected $fillable = [
        'deal_id',
        'course_id',      
    ];
    
     public function getcourses(){
        return $this->hasOne(\App\Models\BusinessCourses\BusinessCourses::class,'id','course_id');
    }
}
