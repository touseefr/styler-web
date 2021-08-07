<?php

namespace App\Models\BusinessCourses;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\SoftDeletes;


class BusinessCourses extends Model {

    use SoftDeletes;
    protected $table = "sc_courses";
    protected $fillable = [
        'course_title',
        'user_id',
        'course_type',
    ];

}
