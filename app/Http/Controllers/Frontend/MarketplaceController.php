<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Repositories\Frontend\Listing\ListingContract;
use App\Repositories\Frontend\Location\LocationContract;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use Image;
use DB;
use App\Businessservices;
use App\Models\Listing\Listing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File as IlluminateFile;


class MarketplaceController extends Controller {

    function __construct(ReviewsContract $review, ListingContract $listing, AssetsContract $assets, BookingController $booking) {
        $this->listing = $listing;
        $this->assets = $assets;
        $this->review = $review;
        $this->booking = $booking;
    }

    public function index() {
        return view('frontend.marketplace.marketplace');
    }

    public function getclassifieds(Request $request) {
        $classified = $this->listing->getMarketplace(99999);
        $return = array();
        foreach ($classified as $val) {
            $return[$val->type][] = $val;
        }
        if (count($return)) {
            $lists[0]['jobCount'] = isset($return['job']) ? count($return['job']) : 0;
            $lists[0]['classifiedsCount'] = isset($return['classified']) ? count($return['classified']) : 0;
            $lists[0]['dealsCount'] = isset($return['deal']) ? count($return['deal']) : 0;
            $lists[0]['businessCount'] = isset($return['businessforsale']) ? count($return['businessforsale']) : 0;
            $lists[0]['galleryCount'] = isset($return['gallery']) ? count($return['gallery']) : 0;
        }
        return response()->json($classified, 200);
    }

    public function makeclassifieds(Request $request) {
        $return_array = array(
            "status" => 210,
            "message" => "Something went wrong please try again later!",
        );
        if ($request->all()) {

            $listing_id = $request->input('listingId');
            $type = $request->input('type');
            $typeDo = $request->input('typeDo');
//            for active and deactive listing
            if ($listing_id) {
                $objListing = Listing::find($listing_id);
                if ($type === 1) {
                    $objListing->status = $typeDo;
                } else if ($type === 2) { // make as sold
                    $objListing->visa_id = $typeDo;
                } else if ($type === 3) { // repost the classified                      
                    $objListing->expiry = date('Y-m-d h:i:s', strtotime('+30 days', strtotime(date('m/d/Y'))));
                }
                $objListing->save();
                if ($objListing) {
                    $return_array['status'] = 200;
                    $return_array['message'] = "Save Successfully";
                }
            }
        }
        return $return_array;
    }

    public function MarketplaceSearch(Request $request) {
        $per_page = 12;
        $query = $request->all();
        if (isset($query['location']) && !empty($query['location'])) {
            $location = json_decode($query['location']);
            $query['names'] = $location->location;
        }
       
        $records = $this->listing->MarketplaceSearch($per_page, $query);        
        foreach($records as $key=>$obj){            
            $records[$key]->sharing_url=url('classifieds?id='.base64_encode($obj->id));

            foreach($records[$key]->assets as $index=>$value){
                if (file_exists( public_path() .$value['path'] . $value['name'])) {                    
                    list($width,$height)=getimagesize(public_path() .$value['path'] . $value['name']);
                    $records[$key]->assets[$index]->width=$width;
                    $records[$key]->assets[$index]->height=$height;

                } else{
                    $records[$key]->assets[$index]->width="";
                    $records[$key]->assets[$index]->height="";
                }
            }                       
        }
        return response()->json($records, 200);
    }

    public function MarketplaceUserAnalytic() {

        if (Auth::user()) {
            $userinfo = array(
                "status" => 200,
                "total" => Listing::where('type', 'classified')->where('user_id', Auth::user()->id)->count(),
                "active" => Listing::where('type', 'classified')->where('status', '1')->where('expiry', '>', date('Y-m-d'))->where('user_id', Auth::user()->id)->count(),
                "expired" => Listing::where('type', 'classified')->where('status', '1')->where('expiry', '<', date('Y-m-d'))->where('user_id', Auth::user()->id)->count(),
                "deactive" => Listing::where('type', 'classified')->where('status', '0')->where('user_id', Auth::user()->id)->count(),
                "sold" => Listing::where('type', 'classified')->where('visa_id', '1')->where('user_id', Auth::user()->id)->count(),
                "user_id" => auth()->user()->id,
                "msg" => "All is Well."
            );
            return response()->json($userinfo, 200);
        } else {
            return response()->json(array("status" => 210, "msg" => "Not Login"), 200);
        }
    }

}
