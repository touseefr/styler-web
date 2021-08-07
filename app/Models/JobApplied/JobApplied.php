<?php

namespace App\Models\JobApplied;

use Illuminate\Database\Eloquent\Model;
use App\Models\Listing\Listing;

class JobApplied extends Model
{
    protected $table = 'job_applied';
    
    protected $fillable = [
        'listing_id',
        'user_id',
        'applic_status',      
    ];
    public function applicantInfo(){
          return   $this->belongsTo(\App\Models\Access\User\User::class,'user_id','id');
    }
    public function getJobsApplications($job_id,$status=0){
        
        return $this->applicantInfo()->where('listing_id',$job_id)->where('applic_status',$status)->get();
        
    }
    public function jobServiceProvider(){
        return $this->hasOne(Listing::class,'id' ,'listing_id');

    }    
}
