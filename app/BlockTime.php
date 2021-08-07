<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlockTime extends Model {
    public $table = 'block_time';
    protected $fillable = [
        'employee_id', 'start_time','end_time','date','book_id','comment',
    ];
}
