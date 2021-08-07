<?php

namespace App\Models\Dealservices;

use Illuminate\Database\Eloquent\Model;

class DealServices extends Model {

    protected $table = 'deal_services';
    protected $fillable = ['service_id', 'deal_id'];

    public function service(){
        
        return $this->belongsTo(\App\Businessservices::class, 'service_id');
        
    }
    
}
