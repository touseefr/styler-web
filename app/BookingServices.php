<?php

namespace App;
use App\Models\Listing\Listing;
use Illuminate\Database\Eloquent\Model;

class BookingServices extends Model {

    protected $table = "bookings_services";
    protected $fillable = [
        'booking_id',
        'service_id',
        'employee_id',
        'date',
        'time',
        'end_time',
        'book_id',
        'status'
    ];

    public function service() {
        return $this->belongsTo(Businessservices::class, 'service_id');
    }

    public function employee() {
        return $this->belongsTo(Employees::class, 'employee_id');
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'service_id');
    }
}
