<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class dealServices extends Model
{
    protected $table = "deal_services";
    protected $fillable = [
        'deal_id',
        'service_id',
    ];

    public function service() {
        return $this->belongsTo(Businessservices::class, 'service_id');
    }
}
