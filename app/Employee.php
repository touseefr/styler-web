<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'zip',
        'address',
        'address_line_1',
        'city',
        'state',
        'phone',
        'mobile',
        'dob',
        'doh',
        'last_work_date',
        'social_security',
        'comment',
        'contractor',
        'gender',
        'role',
        'user_id',
        'parent_id',
        'employee_schedule'
    ];

    public function services()
    {
        return $this->belongsToMany(Businessservices::class, 'employees_services');
    }

    public function bookings()
    {
        return $this->hasMany(Bookings::class, 'employee_id');
    }

    public function schedule()
    {
        return $this->hasMany(EmployeeSchedule::class, 'employee_id')->orderBy('date');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function EmployeeBookingHours()
    {
        return $this->hasMany(BookingServices::class, 'employee_id')->where('status', 'active')->whereDate('date', '>=', date('Y-m-d'));
    }
    public function EmployeeBlockTime()
    {
        return $this->hasMany(BlockTime::class, 'employee_id')->whereDate('date', '>=', date('Y-m-d'));
    }
}
