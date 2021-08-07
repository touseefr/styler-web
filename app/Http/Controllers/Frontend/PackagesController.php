<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\SmsPackage\SmsPackage;
use App\Models\ListingPackage\ListingPackage;
use App\Http\Controllers\Controller;

class PackagesController extends Controller
{

    function __construct()
    { }

    public function getSMSPackages()
    {
        $packages = SmsPackage::where('status', 1)->get();

        $last_selected_package = $this->getLastPaymentEntry();
        foreach ($packages as $key => $package) {
            if ($last_selected_package == $package->id) {
                $packages[$key]->last_selected = 1;
            } else {
                $packages[$key]->last_selected = 0;
            }
        }
        return \GuzzleHttp\json_encode(array("packages" => $packages, "message" => 'success', 'status' => '200'));
    }

    public function getListingPackages()
    {
        $packages = ListingPackage::where('status', 1)->get();

        $last_selected_package = $this->getLastPaymentEntry('listing');
        foreach ($packages as $key => $package) {
            if ($last_selected_package == $package->id) {
                $packages[$key]->last_selected = 1;
            } else {
                $packages[$key]->last_selected = 0;
            }
        }


        return \GuzzleHttp\json_encode(array('packages' => $packages, "message" => 'success', 'status' => '200'));
    }

    private function getLastPaymentEntry($type = 'sms')
    {
        $user_last_package_detail = \App\PackagesPayment::where('package_type', $type)->where('user_id', auth()->user()->id)->orderBy('id', 'desc')->first();
        return $user_last_package_detail ? $user_last_package_detail->package_id : null;
    }
}
