<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Models\Listing\Listing;
use App\Models\Customers\Customers;
use App\Businesservices;

class Booking extends Model
{
    protected $fillable = [
        'employee_id',
        'user_id',
        'service_id',
        'comment',
        'date',
        'time',
        'end_time', 'front_booked',
        'book_id', 'status',
        'customer_id', 'totalprice',
        'discount', 'recurring_id',
        'recurring_booking_id'

    ];
    public function employee()
    {
        return $this->belongsTo(Employees::class, 'employee_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function customer()
    {
        return $this->belongsTo(Models\Customers\Customers::class, 'customer_id');
    }
    public function recurring()
    {
        return $this->belongsTo(Recurring::class, 'recurring_id');
    }
    public function service()
    {
        return $this->belongsTo(Businessservices::class, 'service_id');
    }
    public function services()
    {
        return $this->hasMany(BookingServices::class, 'booking_id');
    }
    public function products()
    {
        return $this->hasMany(BookingsProducts::class, 'booking_id');
    }
    public static function checkEmptySlot($bookingAllData)
    {
        $data = [];
        $counter = 0;
        foreach ($bookingAllData as $service) {
            $data[$counter]  = Booking::checktimeIntervalEmployee($service['employee_id'], $service['time'], $service['end_time'], $service['date'], null, $service['serviceType']);
            $counter++;
        }
        return $data;
    }
    public static function onlineBooking($bookinginfo)
    {
        $results = array("status" => "210", "msg" => "Something went wrong Please try later.");
        $date = date('Y-m-d', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date']))));
        $customer_id = $bookinginfo['user_id'];
        $customer_info = User::where('id', $bookinginfo['user_id'])->first();
        $count = 0;
        $processing_time = '';
        $next_start_date = '';
        $bookingAllData = array();
        foreach ($bookinginfo['services'] as $data) {
            $bookingservicesrow = array();
            $duration = 0;
            $ServicePrice = 0;
            $finish_status = 0;
            $finish_start_date = '';
            $finish_end_date = '';
            $finish_duration = '';
            $process_duration = 0;
            $process_start_time = null;
            $busService = Businessservices::find($data['id']);
            if ($busService) {
                $duration = $busService['duration'];
                $ServicePrice = $busService['price'];
                if ($count === 0) {
                    $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date']))));
                    $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date'] . "+" . $busService['duration'] . " minutes"))));
                    if ($busService['process_time'] && !empty($busService['process_time'])) {
                        $process_start_time = $end_date;
                        $next_start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($end_date . "+" . $busService['process_time']  . " minutes"))));
                    } else {
                        $next_start_date = $end_date;
                    }
                } else {
                    $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($next_start_date))));
                    $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($start_date . "+" . $busService['duration'] . " minutes"))));

                    if ($busService['process_time'] && !empty($busService['process_time'])) {
                        $process_start_time = $end_date;
                        $next_start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($end_date . "+" . $busService['process_time']  . " minutes"))));
                    } else {
                        $next_start_date = $end_date;
                    }
                }
                if ($busService['finish_time'] && !empty($busService['finish_time'])) {
                    $process_duration = $busService['process_time'];
                    $finish_status = 1;
                    $finish_start_date = $next_start_date;
                    $finish_end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($finish_start_date . "+" . $busService['finish_time']  . " minutes"))));
                    $finish_duration = $busService['finish_time'];
                    $next_start_date = $finish_end_date;
                }
            } else {
                $listingService = Listing::find($data['id']);
                $duration = $listingService['duration'];
                $ServicePrice = $listingService['saving'];
                if ($count === 0) {
                    $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date']))));
                    $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($bookinginfo['start_date'] . "+" . $listingService['duration'] . " minutes"))));
                } else {
                    $start_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($next_start_date))));
                    $end_date = date('D M j Y H:i:s', strtotime(date('Y-m-d H:i:s', strtotime($start_date . "+" . $listingService['duration'] . " minutes"))));
                }
                $next_start_date = $end_date;
            }
            $bookingservicesrow['service_id'] = $data['id'];
            $bookingservicesrow['employee_id'] = $bookinginfo['employeeid'];
            $bookingservicesrow['date'] = $date;
            $bookingservicesrow['time'] = $start_date;
            $bookingservicesrow['end_time'] = $end_date;
            $bookingservicesrow['duration'] = $duration;
            $bookingservicesrow['book_id'] = Booking::randomString(4) . '-' . Booking::randomString(4) . '-' . Booking::randomString(4) . '-' . Booking::randomString(4);
            $bookingservicesrow['price'] = $ServicePrice;
            $bookingservicesrow['process_start_time'] = $process_start_time;
            if ($finish_status == 1) {
                $bookdataarray = array(
                    'employee_id' => $bookinginfo['employeeid'],
                    'time' => $finish_start_date,
                    'end_time' => $finish_end_date,
                    'book_id' => Booking::randomString(4) . '-' . Booking::randomString(4) . '-' . Booking::randomString(4) . '-' . Booking::randomString(4),
                    'duration' => $finish_duration,
                    'child' => 1
                );
                $bookingservicesrow['finish_status'] = 1;
                $bookingservicesrow['finish_book_id'] = json_encode($bookdataarray);
                $bookingservicesrow['finish_employee_id'] = $bookinginfo['employeeid'];
            }
            $bookingservicesrow['status'] = 'active';
            $bookingservicesrow['process_duration'] = $process_duration;
            if (isset($data['type'])) {
                $bookingservicesrow['serviceType'] = ($data['type'] && $data['type'] == 'deal') ? 1 : 0;
            } else {
                $bookingservicesrow['serviceType'] = 0;
            }
            $count++;
            array_push($bookingAllData, $bookingservicesrow);
            $processing_time = $busService['process_time'];
        }
        $data['status'] = 200;
        $data['skipconflictBooking'] = 0;
        $data['response'] = Booking::checkEmptySlot($bookingAllData);
        foreach ($data['response'] as $key => $value) {
            if ($value['status'] == "210") {
                $data['status'] = $value['status'];
                $data['skipconflictBooking'] = 1;
                break;
            }
        }
        if ($data['skipconflictBooking'] != 1) {
            $objBooking = new Booking();
            $objBooking->user_id = $bookinginfo['businessid'];
            $objBooking->totalprice = $bookinginfo['total_price'];
            $objBooking->date = $date;
            $objBooking->customer_id = Booking::checkCustomerInfo($customer_info, $bookinginfo['businessid']);
            $objBooking->discount = 0;
            $objBooking->front_booked = 1;
            $objBooking->status = 'Pending';
            $objBooking->save();
            $bookingId = $objBooking->id;
            foreach ($bookingAllData as $key => $value) {
                $objBookingService = new BookingServices();
                $objBookingService->booking_id = $bookingId;
                $objBookingService->service_id = $value['service_id'];
                $objBookingService->employee_id = $value['employee_id'];
                $objBookingService->date = $value['date'];
                $objBookingService->time = $value['time'];
                $objBookingService->end_time = $value['end_time'];
                $objBookingService->price = $value['price'];
                $objBookingService->duration = $value['duration'];
                $objBookingService->process_start_time = $value['process_start_time'];
                if (isset($value['finish_status'])) {
                    $objBookingService->finish_status = $value['finish_status'];
                    $objBookingService->finish_book_id = $value['finish_book_id'];
                    $objBookingService->finish_employee_id = $value['employee_id'];
                }
                $objBookingService->book_id = $value['book_id'];
                $objBookingService->status = $value['status'];
                $objBookingService->process_duration = $value['process_duration'];
                $objBookingService->serviceType = $value['serviceType'];
                $objBookingService->save();
            }
            $results = array("status" => "200", 'bookingId' => $bookingId, 'businessid' => $bookinginfo['businessid']);
        } else {
            $results = array("status" => "210", "msg" => "This Slot is not available any more.");
        }
        return $results;
    }

    public static function checkCustomerInfo($userinfo, $sp_id)
    {

        $customerInfo = array();
        if ($userinfo) {
            $userName = explode(' ', $userinfo->name);
            $first_name = '';
            $last_name = '';
            if (count($userName) == 1) {
                $first_name = $userName[0];
            } else if (count($userName) == 2) {
                $first_name = $userName[0];
                $last_name = $userName[1];
            } else {
                $first_name = $userName[0];
                array_shift($userName);
                $last_name = implode(' ', $userName);
            }
            $customers = Customers::where('email', $userinfo->email)->get();
            //            print_r($customers);
            //            exit;
            if ($customers->count() > 0) {
                $have = 0;
                foreach ($customers->toArray() as $key => $values) {
                    if ($values['parent_id'] == $sp_id) {
                        $have = $values;
                        break;
                    }
                }
                if ($have) {
                    $obj_customer = Customers::find($have['id']);
                    $obj_customer->web_account_type = '1';
                    $obj_customer->user_id = $userinfo->id;
                    $obj_customer->update();
                    $customerInfo = $have['id'];
                } else {
                    $obj_customer = new Customers();
                    $obj_customer->user_id = $userinfo->id;
                    $obj_customer->email = $userinfo->email;
                    $obj_customer->first_name = $first_name;
                    $obj_customer->last_name = $last_name;
                    $obj_customer->active = '1';
                    $obj_customer->web_account_type = '1';
                    $obj_customer->parent_id = $sp_id;
                    $obj_customer->profile_pic = $userinfo->profile_pic;
                    $obj_customer->customer_id = Booking::getCustomerRegisterId($sp_id);
                    $obj_customer->save($customerInfo);
                    $customerInfo = $obj_customer->id;
                }
            } else {
                $obj_customer = new Customers();
                $obj_customer->user_id = $userinfo->id;
                $obj_customer->email = $userinfo->email;
                $obj_customer->first_name = $first_name;
                $obj_customer->last_name = $last_name;
                $obj_customer->active = '1';
                $obj_customer->web_account_type = '1';
                $obj_customer->parent_id = $sp_id;
                $obj_customer->profile_pic = $userinfo->profile_pic;
                $obj_customer->customer_id = Booking::getCustomerRegisterId($sp_id);
                $obj_customer->save($customerInfo);
                $customerInfo = $obj_customer->id;
            }
        }
        return $customerInfo;
    }

    public static function getCustomerRegisterId($id)
    {
        $customer = Customers::where('parent_id', $id)->select('customer_id')->orderBy('id', 'DESC')->first();
        $values = '';
        if (empty($customer->customer_id)) {
            $values = 1000;
        } else {
            $values = $customer->customer_id + 1;
        }
        return $values;
    }

    public static function checktimeIntervalEmployee($employee, $start, $end, $date, $id, $serviceType = 0)
    {
        $response = array('status' => '200', 'message' => 'Available Slot');
        if ($serviceType == 2) {
            return $response;
        }
        $startTime = date('Y-m-d H:i:s', strtotime($start));
        $endTime = date('Y-m-d H:i:s', strtotime($end));
        $StartOverlap = null;
        $EndOverlap = null;
        $blocktime = \DB::table("block_time")->where('employee_id', $employee)->where('book_id', '!=', $id)->whereDate('date', '=', $date)->get();
        if (count($blocktime) > 0 && $response['status'] == "200") {
            foreach ($blocktime as $index => $value) {
                $start_date1 = date('Y-m-d H:i:s', strtotime($value->start_time));
                $end_date1 = date('Y-m-d H:i:s', strtotime($value->end_time));
                $StartOverlap = Booking::check_in_range_dates($start_date1, $end_date1, $startTime, 'start');
                $EndOverlap = Booking::check_in_range_dates($start_date1, $end_date1, $endTime, 'end');
                if ($StartOverlap || $EndOverlap) {
                    $response['status'] = "210";
                    $response['message'] = "Appointment conflict with Block Time.";
                    break;
                }

                $StartOverlap = Booking::check_in_range_dates($startTime, $endTime, $start_date1, 'start');
                $EndOverlap = Booking::check_in_range_dates($startTime, $endTime, $end_date1, 'end');
                if ($StartOverlap || $EndOverlap) {
                    $response['status'] = "210";
                    $response['message'] = "Appointment conflict with Block Time.";
                    break;
                }
            }
        }
        $employees = \DB::table("employees")->find($employee);
        if ($employees && $employees->employee_schedule && $response['status'] == "200") {
            $schedule = json_decode($employees->employee_schedule, true);
            $dayName = strtolower(date('l', strtotime($date)));
            if ($schedule[$dayName]['start'] == "") {
                $response['status'] = "210";
                $response['message'] = "Appointment conflict with Employee Off Day.";
            } else {
                $start_date1 = Booking::dateMerge($schedule[$dayName]['start'], $date);
                $end_date1 = Booking::dateMerge($schedule[$dayName]['end'], $date);
                $StartOverlap = Booking::check_in_range_dates($start_date1, $end_date1, $startTime, 'start');
                $EndOverlap = Booking::check_in_range_dates($start_date1, $end_date1, $endTime, 'end');
                $response['message'] = "Appointment conflict with Employee Off Day.";
                if ($StartOverlap && $EndOverlap) {
                    if (count($schedule[$dayName]['break']) > 0) {
                        foreach ($schedule[$dayName]['break'] as $index => $value) {
                            if (count($value) > 0) {
                                // print_r('asdasdas');
                                $start_date1 = Booking::dateMerge($value['start'], $date);
                                $end_date1 = Booking::dateMerge($value['end'], $date);
                                $StartOverlap = Booking::check_in_range_dates($start_date1, $end_date1, $startTime, 'start');
                                $EndOverlap = Booking::check_in_range_dates($start_date1, $end_date1, $endTime, 'end');
                                if ($StartOverlap || $EndOverlap) {
                                    $response['status'] = "210";
                                    $response['message'] = "Appointment conflict with Break Time.";
                                    break;
                                }

                                $StartOverlap = Booking::check_in_range_dates($startTime, $endTime, $start_date1, 'start');
                                $EndOverlap = Booking::check_in_range_dates($startTime, $endTime, $end_date1, 'end');
                                if ($StartOverlap || $EndOverlap) {
                                    $response['status'] = "210";
                                    $response['message'] = "Appointment conflict with Break Time.";
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    $response['status'] = "210";
                    $response['message'] = "Appointment conflict with Employee Not Working Time.";
                }
            }
        }
        return $response;
    }
    public static function dateMerge($time, $date)
    {
        $d = date('Y-m-d', strtotime($date));
        $da = date('H:i:s', strtotime($time));
        $merge = $d . ' ' . $da;
        $merge = date('Y-m-d H:i:s', strtotime($merge));
        return $merge;
    }
    public static function check_in_range_dates($start_date, $end_date, $date_from_user, $timetype = 'start')
    {
        // Convert to timestamp
        $start_ts = strtotime($start_date);
        $end_ts = strtotime($end_date);
        $user_ts = strtotime($date_from_user);
        // Check that user date is between start & end
        if ($timetype == 'start')
            return (($user_ts >= $start_ts) && ($user_ts < $end_ts));
        else
            return (($user_ts > $start_ts) && ($user_ts <= $end_ts));
    }
    public static function randomString($length = 6)
    {
        $str = "";
        $characters = array_merge(range('0', '9'));
        $max = count($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $rand = mt_rand(0, $max);
            $str .= $characters[$rand];
        }
        return $str;
    }
}
