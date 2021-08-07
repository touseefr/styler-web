<?php

namespace App\Models\Plans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Plans\Traits\Relationship\PlansRelationship;


class Plans extends Model
{
    use SoftDeletes,PlansRelationship;    
    protected $table='plans';
    protected $guarded=['id'];
}
