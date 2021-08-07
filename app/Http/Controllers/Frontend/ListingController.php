<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Frontend\BookingController;
use App\Http\Requests\Frontend\Listing\CreatelistingRequest;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Repositories\Frontend\Listing\ListingContract;
use App\Repositories\Frontend\Location\LocationContract;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use App\Repositories\Frontend\Categories\CategoriesContract;
use App\Repositories\Frontend\User\UserContract;
use Exception;
use App\Jobs\StylerZoneEmails;
use Flow\Config as FlowConfig;
use Flow\File as FlowFile;
use Flow\Request as FlowRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Image;
use DB;
use App\Businessservices;
use App\Models\Listing\Listing;

/**
 * Class DashboardController
 * @package App\Http\Controllers\Frontend
 */
class ListingController extends Controller {

    /**
     * [$listing description]
     * @var [type]
     */
    function __construct(ReviewsContract $review, ListingContract $listing, AssetsContract $assets, BookingController $booking) {
        $this->listing = $listing;
        $this->assets = $assets;
        $this->review = $review;
        $this->booking = $booking;
    }

    /**
     * Get all listing
     * @return Array jobs list
     */
    public function index() {
        $per_page = \Input::get('per_page');
        $lists = array();
        $lists = $this->listing->paginated($per_page, 1, 'id', 'desc');
        $return = array();
        foreach ($lists as $val) {
            $return[$val->type][] = $val;
        }
        if (count($return)) {
            $lists[0]['jobCount'] = isset($return['job']) ? count($return['job']) : 0;
            $lists[0]['classifiedsCount'] = isset($return['classified']) ? count($return['classified']) : 0;
            $lists[0]['dealsCount'] = isset($return['deal']) ? count($return['deal']) : 0;
            $lists[0]['businessCount'] = isset($return['businessforsale']) ? count($return['businessforsale']) : 0;
            $lists[0]['galleryCount'] = isset($return['gallery']) ? count($return['gallery']) : 0;
        }

        return response()->json($lists, 200);
    }

    public function _group_by($array, $key) {
        $return = array();
        foreach ($array as $val) {
            $return[$val[$key]][] = $val;
        }
        return $return;
    }

    /**
     * create new listing
     * params Array $params
     * @return id
     */
    public function save(CreatelistingRequest $request) {

        $list = $this->listing->create($request->all());
        $listtype = array(
            "classified" => "classifieds",
            "deal" => "deals",
            "job" => "jobs",
            "businessforsale" => "business",
        );
        $data = $request->all();
        $data['business_email'] = Auth::user()->userBusiness->business_email;
        $data['username'] = Auth::user()->name;
        $data['url'] = url($listtype[$request->input('type')] . "?id=" . base64_encode($list->id));
        $this->dispatch((new StylerZoneEmails(['business_name' => Auth::user()->UserBusiness->business_name, 'list_id' => base64_encode($list->id), 'data' => $data, 'id' => base64_encode(Auth::user()->id)], 'emails.listing.create')));
        return response()->json($list, 200);
    }

    /**
     * [get description]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function get($id) {
        $list = $this->listing->findOrThrowException($id);
        return response()->json($list, 200);
    }

    /**
     * [get classifieds]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function classifieds(CreatelistingRequest $request) {
        $per_page = 1;
        $classified = $this->listing->getListingByTypePaginated($request->all(), 'classified', $per_page);
//        $classified[0]['assets'] = $this->getJobGalleryImages($classified[0]->user_id);
        $user_id = $payment_mode = '';
        // get payment mode via user id
        if (!empty($classified[0]->user_id)) {
            $payment_mode = $this->getpaymentmode($classified[0]->user_id);
        }
        $this->listing->updateListingView($classified[0]->id, $classified[0]->user_id);
        if (isset($classified[0]->user->userBusiness->operating_hours)) {
            $classified[0]->user->userBusiness->operating_hours = json_decode($classified[0]->user->userBusiness->operating_hours);
        }
        return view('frontend.listing.classifieds', array('payment_mode' => $payment_mode, 'roles_id' => $this->getalluserroles()))
                        ->withRecords($classified);
    }

    /**
     * [get classifieds]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function gallery(CreatelistingRequest $request) {
        $per_page = 1;
        $gallery = $this->listing->getListingByTypePaginated($request->all(), 'gallery', $per_page);
        $this->listing->updateListingView($gallery[0]->id, $gallery[0]->user_id);
        $gallery[0]->user->userBusiness->operating_hours = json_decode($gallery[0]->user->userBusiness->operating_hours);
        return view('frontend.listing.gallery')
                        ->withRecords($gallery);
    }

    /**
     * [get classifieds]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function serviceprovidergallery($id) {
        $per_page = 50;
//        $gallery = $this->assets->getUserGallery($id, $per_page);
        $gallery = $this->getJobGalleryImages($id);
//        print_r($gallery);
        return view('frontend.listing.serviceprovidergallery')
                        ->withRecords($gallery);
    }

    /**
     * [get classifieds]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function serviceprovidergalleryall() {
        $per_page = 20;
        $gallery = $this->assets->getUserGalleryAll($per_page);

        $is_api = \Input::get('is_api');

        if ($is_api) {
            return response()->json($gallery, 200);
        } else {
            return view('frontend.listing.serviceprovidergalleryall')
                            ->withRecords($gallery);
        }
    }

    /**
     * [get jobs]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function jobs(CreatelistingRequest $request) {
        $per_page = 1;
        $job = $this->listing->getListingByTypePaginated($request->all(), 'job', $per_page);
//        $job[0]['assets'] = $this->getJobGalleryImages($job[0]['user_id']);
        if (count($job)) {
            $this->listing->updateListingView($job[0]->id, $job[0]->user_id);
            if (isset($job[0]->user->userBusiness->operating_hours)) {
                $job[0]->user->userBusiness->operating_hours = json_decode($job[0]->user->userBusiness->operating_hours);
            }
        }
        $status = false;
        if (auth()->user()) {
            if (count(auth()->user()->jobApplied()->get()->toArray()) > 0) {
                foreach (auth()->user()->jobApplied()->get()->toArray() as $list) {
                    if ($list['id'] == $job[0]->id) {
                        $status = true;
                        break;
                    }
                }
            }
        }
        return view('frontend.listing.jobs')->withRecords($job)->withApplied($status);
    }

    public function getJobGalleryImages($user_id) {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        $images_info = array();
        if (!empty($user_meta) && $user_meta->count() > 0) {
            $assets_ids = unserialize($user_meta[0]->value);
            $images_info = array();
            foreach ($assets_ids as $cat_id => $catimages) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();
                foreach ($catimages as $imgid => $imagtitle) {
                    $image_id = $imgid;
                    $image_title = $imagtitle['title'];
                    if (!empty($image_id)) {
                        $assets = \DB::table('assets')->where(array('id' => trim(strip_tags($image_id))))->get();
                        foreach ($assets as $asset) {
                            $images_info[] = array(
                                'id' => $asset->id,
                                'name' => $asset->name,
                                'path' => $asset->path,
                                'title' => $image_title,
                                'image_cat' => $cate_info[0]->name,
                                'cat_id' => $cate_id
                            );
                        }
                    }
                }
            }
        }
        return $images_info;
    }

    /**
     * [get deals]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function deals(CreatelistingRequest $request) {
        $per_page = 1;
        $payment_mode = '';
        $deal = $this->listing->getListingByTypePaginated($request->all(), 'deal', $per_page);

        if (count($deal)) {
            $this->listing->updateListingView($deal[0]->id, $deal[0]->user_id);
            if (isset($deal[0]->user->userBusiness->operating_hours)) {
                $deal[0]->user->userBusiness->operating_hours = json_decode($deal[0]->user->userBusiness->operating_hours);
            }
            if (isset($deal[0]->listingMeta)) {
                $meta_key_value = array();

                foreach ($deal[0]->listingMeta as $meta) {
                    if ($meta['meta_key'] == 'days_valid') {
                        $meta['meta_value'] = json_decode($meta['meta_value']);
                    }
                    $meta_key_value[$meta['meta_key']] = $meta['meta_value'];
                }
                unset($deal[0]->listingMeta);
                $deal[0]->listing_meta = $meta_key_value;
            }
        }
        if (!empty($deal[0]->user_id)) {
            $payment_mode = $this->getpaymentmode($deal[0]->user_id);
        }
//        $deal[0]['assets'] = $this->getJobGalleryImages($deal[0]->user_id);
        $similardeals = $this->listing->getSimilarDeals($request->all(), 'deal');
//        echo "<pre>";
//        print_r($similardeals);
//        exit;
        foreach ($similardeals as $key => $value) {
            $similardeals[$key]['assets'] = $this->getJobGalleryImages($value->user_id);
        }
        $userInfo = $this->booking->getUserInfo($deal[0]->user_id);
        return view('frontend.listing.deals', array('payment_mode' => $payment_mode))->withRecords($deal)->withSimilardeals($similardeals)->withEmployees($userInfo);
    }

    /**
     * [get deals]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function getListingByCat(CreatelistingRequest $request) {
        $per_page = \Input::get('per_page');
        $is_api = \Input::get('is_api');
        $type = \Input::get('type');
        if ($is_api) {
            $per_page = $per_page ? $per_page : 10;
            $listing = $this->listing->getListingByCatPaginated($type, $request->all(), $per_page);
            $listing_array = $listing->toArray();
//            if ($listing_array) {
//                $listing_array['data'] = $this->addAssetsToListing($listing_array['data']);
//            }
            return response()->json($listing_array, 200);
        } else {
            return view('frontend.listing.listing-by-cat', array('type', $type))
                            ->withType($type);
        }
    }

    public function addAssetsToListing($listingData) {
        $data_info = array();
        if ($listingData) {
            foreach ($listingData as $key => $list) {
                $listingData[$key]['assets'] = $this->getJobGalleryImages($list['user_id']);
            }
            $data_info = $listingData;
        }
        return $data_info;
    }

    /**
     * [get deals]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function reportBusiness(CreatelistingRequest $request) {
        $data = $request->all();
        $business_name = $data['item_title'];
        $type = $data['type'];

        if (!empty($data)) {

            try {
                $to = env("ADMIN_EMAIL_REPORT", "");

                $from = Auth::User()->email;
                $from_name = Auth::User()->name;

                $message = ucfirst($type) . " (" . $business_name . ") has been reported";

                $datas = array('type' => $type, 'MESSAGE' => $message, 'FROM' => $from, 'FROM_NAME' => $from_name, 'EMAIL' => $to);
                $this->dispatch((new StylerZoneEmails($datas, 'emails.business-report')));
//                Mail::send('emails.business-report', $datas, function ($message) use ($datas) {
//                    $subject = ucfirst($datas['type']) . " Reported";
//
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
////                    $message->from($datas['FROM'], $datas['FROM_NAME']);
//
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });

                return response()->json(array('msg' => 'success'), 200);
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }
        }

        return response()->json(array(), 500);
    }

    /**
     * [get businesss  for sale]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function business(CreatelistingRequest $request) {
        $per_page = 1;
        $payment_mode = null;
        $businessforsale = $this->listing->getListingByTypePaginated($request->all(), 'businessforsale', $per_page);
//        $businessforsale[0]['assets'] = $this->getJobGalleryImages($businessforsale[0]['user_id']);
        // get payment mode via user id
        if (!empty($businessforsale[0]->user_id)) {
            $payment_mode = $this->getpaymentmode($businessforsale[0]->user_id);
        }
        if (count($businessforsale)) {
            $this->listing->updateListingView($businessforsale[0]->id, $businessforsale[0]->user_id);
            if (isset($businessforsale[0]->user->userBusiness->operating_hours)) {
                $businessforsale[0]->user->userBusiness->operating_hours = json_decode($businessforsale[0]->user->userBusiness->operating_hours);
            }
        }
        return view('frontend.listing.business', array('payment_mode' => $payment_mode, 'roles_id' => $this->getalluserroles()))
                        ->withRecords($businessforsale);
    }

    /**
     * [get schoolcollages]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function schoolcolleges(CreatelistingRequest $request) {
        $per_page = 1;
        $result = $this->listing->getListingByTypePaginated($request->all(), 'schoolcolleges', $per_page);
        return view('frontend.listing.schoolcollages')
                        ->withRecords($result);
    }

    /**
     * [update description]
     * @param  [type]               $id      [description]
     * @param  CreatelistingRequest $request [description]
     * @return [type]                        [description]
     */
    public function update($id, CreatelistingRequest $request) {
        if (!$id) {
            return response()->json([
                        'error' => [
                            'message' => 'Listing id does not exits',
                        ],
                            ], 422);
        }
        $list = $this->listing->update($id, $request->all());
        return response()->json($list, 200);
    }

    /**
     * [delete description]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function delete($id) {
        if (!$id) {
            return response()->json([
                        'error' => [
                            'message' => 'Listing id does not exits',
                        ],
                            ], 422);
        }

        $list = $this->listing->delete($id);
        return response()->json($list, 200);
    }

    /**
     * [upload description]
     * @return [type] [description]
     */
    public function upload() {
        $config = new FlowConfig(array(
            'tempDir' => storage_path() . '/chunks_temp', //With write access
        ));
        $config->setDeleteChunksOnSave(false);
        $request = new FlowRequest();
        $file = new FlowFile($config, $request);
        $response = response()->json('', 200);
        $fileName = time() . '_' . $request->getFileName();
        $destination = public_path() . '/assets/listing/large/' . $fileName;

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            error_log('Documento GET');
            if (!$file->checkChunk()) {
                error_log('Documento GET2');
                return response()->json('', 204);
            }
        } else {
            list($width, $height) = @getimagesize($_FILES['file']['tmp_name']);

//            if (!$width || !$height) {
//                return response()->json('Error in file', 400);
//            } else {
            if ((!empty($width) && $width < 800) || (!empty($height) && $height < 400)) {
                return response()->json('Please upload larger image greater than 800X400', 400);
            }
//        }

            if ($file->validateChunk()) {
                $file->saveChunk();
                error_log('Documento VaLido !!!');
            } else {
                error_log('Documento INVALIDO');
                return response()->json('Error in chunck', 400);
            }
        }
        if ($file->validateFile() && $file->save($destination)) {
            $fileInfo['name'] = $fileName;
            $fileInfo['path'] = '/assets/listing/large/';
            $fileInfo['ext'] = pathinfo($fileName, PATHINFO_EXTENSION);
            \Illuminate\Support\Facades\DB::table('listing_assets')->where('listing_id', \Input::get('id'))->delete();
            $image = $this->assets->create($fileInfo, \Input::get('id'));
            error_log('EXITO!');
            // open an image file
            $org = public_path() . $fileInfo['path'] . $fileName;
            $thumb = public_path() . $fileInfo['path'] . 'thumb_small_' . $fileName;
            $small_thumb = public_path() . $fileInfo['path'] . 'small_' . $fileName;
            $img = Image::make($org);
            $img->resize(255, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $img->save($thumb);
            $img->resize(100, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $img->save($small_thumb);
            $response = response()->json($image['id'], 200);
        }
        return $response;
    }

    public function search(CreatelistingRequest $request, userContract $user, CategoriesContract $categories) {
        $inputs = $request->all();
        $searchFor = $inputs['searchFor'];
        $activetab = "deal";
        if ($request->has('activetab')) {
            $activetab = $input['activetab'];
        }
        if ($request->wantsJson()) {
            $result = $this->listing->search($request->all(), $searchFor, 1);
            return response()->json($result, 200);
        } else {
            $per_page = 10;
            $latestReview = $this->review->getLatestReview($per_page);
            if(Auth::user()->roles[0]->name == 'Distributor'){
                $serviceCategories = $categories->getcategoriesByType('service')->where('parent','!=','')->toArray();
                $topbusiness = DB::select("SELECT users.id,users.rating,user_business.business_name,user_business.state,user_business.business_suburb,user_business.about,(SELECT COUNT(rating_reviews.id) FROM rating_reviews WHERE rating_reviews.from_user_id=users.id OR rating_reviews.to_user_id=users.id) AS 'total_reviews' FROM users inner join user_business on user_business.user_id=users.id and users.status!=0 ORDER BY users.rating DESC limit 3");
                return view('frontend.listing.search')->withActivetab($activetab)->withLatestreviews($latestReview)->withbusiness($topbusiness)->with('service_categories', json_encode($serviceCategories));
            }if(Auth::user()->roles[0]->name == 'ServiceProvider'){
            $serviceCategories = $categories->getcategoriesByType('distributor')->where('parent','!=','')->toArray();
            $topbusiness = DB::select("SELECT users.id,users.rating,user_business.business_name,user_business.state,user_business.business_suburb,user_business.about,(SELECT COUNT(rating_reviews.id) FROM rating_reviews WHERE rating_reviews.from_user_id=users.id OR rating_reviews.to_user_id=users.id) AS 'total_reviews' FROM users inner join user_business on user_business.user_id=users.id and users.status!=0 ORDER BY users.rating DESC limit 3");
            return view('frontend.listing.search')->withActivetab($activetab)->withLatestreviews($latestReview)->withbusiness($topbusiness)->with('service_categories', json_encode($serviceCategories));       
        }
        if(Auth::user()->roles[0]->name == 'SchoolCollege'){
            $serviceCategories = $categories->getcategoriesByType('service')->where('parent','!=','')->toArray();
            $topbusiness = DB::select("SELECT users.id,users.rating,user_business.business_name,user_business.state,user_business.business_suburb,user_business.about,(SELECT COUNT(rating_reviews.id) FROM rating_reviews WHERE rating_reviews.from_user_id=users.id OR rating_reviews.to_user_id=users.id) AS 'total_reviews' FROM users inner join user_business on user_business.user_id=users.id and users.status!=0 ORDER BY users.rating DESC limit 3");
            return view('frontend.listing.search')->withActivetab($activetab)->withLatestreviews($latestReview)->withbusiness($topbusiness)->with('service_categories', json_encode($serviceCategories));    
    }
    if(Auth::user()->roles[0]->name == 'Individual' || Auth::user()->roles[0]->name == 'JobSeeker'){
        $serviceCategories = $categories->getcategoriesByType('service')->where('parent','!=','')->toArray();
        $topbusiness = DB::select("SELECT users.id,users.rating,user_business.business_name,user_business.state,user_business.business_suburb,user_business.about,(SELECT COUNT(rating_reviews.id) FROM rating_reviews WHERE rating_reviews.from_user_id=users.id OR rating_reviews.to_user_id=users.id) AS 'total_reviews' FROM users inner join user_business on user_business.user_id=users.id and users.status!=0 ORDER BY users.rating DESC limit 3");
        return view('frontend.listing.search')->withActivetab($activetab)->withLatestreviews($latestReview)->withbusiness($topbusiness)->with('service_categories', json_encode($serviceCategories));    
    }
    }
    }
    public function SearchDesign() {
        return view('frontend.listing.newDesignTest');
    }

    public function getrecords(CreatelistingRequest $request, userContract $user, LocationContract $location) {
        $inputs = $request->all();
        $zipcodes = array();
        $inputs['radius'] = 10;
        $filters = array();
        $searchFor = explode(',', $inputs['searchFor']);
        $filterFor = explode(',', $inputs['filter_for']);
        $ratings = explode(',', $inputs['rating']);
        $locations = explode(',', $inputs['locations']);
        $subCategory = explode(',', $inputs['sub_category']);
        $sortBy = (isset($inputs['sortBy'])) ? explode(',', $inputs['sortBy']) : '';
        $sortType = (isset($inputs['sortBy'])) ? explode(',', $inputs['sortType']) : '';

        foreach ($searchFor as $key => $value) {
            $type = $value;
            $filters['rating'] = $filters['subCategory'] = $filters['zipcodes'] = 0;
            if (count($filterFor) && in_array($value, $filterFor)) {
                $key = array_search($value, $filterFor);
                $filters['rating'] = $ratings[$key] ? $ratings[$key] : 0;
                $filters['subCategory'] = $subCategory[$key] ? $subCategory[$key] : 0;
                $filters['sortBy'] = $sortBy ? $sortBy[0] : 0;
                $filters['sortType'] = $sortType ? $sortType[0] : 0;

                if (isset($locations[$key]) && $locations[$key]) {
                    $filters['post'] = $locations[$key];
                    $filters['state'] = '';
                    $filters['radius'] = 10;
                    $filters['zipcodes'] = $this->nearestLocation($filters, $location);
                } else {
                    $filters['zipcodes'] = $this->nearestLocation($inputs, $location);
                }
            } else {
                if ((isset($inputs['post']) && trim($inputs['post']) != '') || (isset($inputs['state']) && trim($inputs['state']) != '')) {
                    $filters['zipcodes'] = $this->nearestLocation($inputs, $location);
                }
            }

            $states = array('VIC', 'NSW', 'QUE', 'WA', 'SA', 'NT', 'TAS');
            if ($inputs['location_address']) {
                $location_arr = explode(',', $inputs['location_address']);
                if (count($location_arr) == 3) {
                    $filters['name'] = @$location_arr[0];
                    $filters['state'] = @$location_arr[1];
                    $filters['postcode'] = @$location_arr[2];
                } elseif (in_array($inputs['location_address'], $states)) {
                    $filters['statess'] = array(@$inputs['location_address']);
                } elseif (is_numeric($inputs['location_address'])) {
                    $filters['zipcodes'] = array(@$inputs['location_address']);
                } else {
                    $filters['names'] = array(@$inputs['location_address']);
                }
            }
            if ($value == 'serviceprovider') {
                $type = 'ServiceProvider';
            }
            if ($value == 'distributor') {
                $type = 'Distributor';
            }
            if ($type == "job" && Auth::check() && Auth::user()->roles[0]->name == "ServiceProvider") {
                $records = $this->listing->searchJobSeeker($inputs, $type, 0, $filters);
            } else {
                $records = $this->listing->search($inputs, $type, 0, $filters);
                // print_r($records);
                // exit;
                if($type=='ServiceProvider'){
                    foreach($records['data'] as $key=>$values){
                        $logoData=\Illuminate\Support\Facades\DB::table('user_meta')->where('user_id',$values['id'])->where('key','userBanner')->get();
                        if($logoData->count()>0){
                            $records['data'][$key]['banner_image']=$logoData[0]->value;
                        }else{
                            $records['data'][$key]['banner_image']='';
                        }
                    }
                }
            }
            $result[$value] = $records['data'];
        }
         $AuthCheck=1;
         if(Auth::check()){
            $AuthCheck=2;             
         }
        return response()->json(array("results"=>$result,"auth_check"=>$AuthCheck), 200);
    }

    public function nearestLocation($inputs, $location) {
        $zipcodes = array();
        $nearestlocation = $location->nearestlocation($inputs);

        if (!empty($nearestlocation) && count($nearestlocation)) {
            foreach ($nearestlocation as $key => $value) {
                array_push($zipcodes, $value['postcode']);
            }
            return array_unique($zipcodes);
        } else {
            return 0;
        }
    }

    public function cancelimage(CreatelistingRequest $request) {
        if (!isset($request->all()['id'])) {
            return true;
        }
        $id = $request->all()['id'];
        $listId = "null";
        if (\Input::has("list_id")) {
            $listId = \Input::get('list_id');
        }
        $asset = $this->assets->findOrThrowException($id);
        $destination = public_path() . $asset->path . $asset->name;
        if (file_exists($destination)) {
            unlink($destination);
            unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
        }
        $this->assets->delete($id, $listId);
    }

    public function shortlistjob(CreatelistingRequest $request, userContract $user) {
        $responce = $user->getShortlistJob($request->all());
        return $responce;
    }

    public function activatejob(CreatelistingRequest $request) {
        $list = $this->listing->activatejob($request->all());
        return response()->json($list, 200);
        //return $responce;
    }

    public function addtowatchlist(CreatelistingRequest $request, userContract $user) {
        $responce = $user->addtowatchlist($request->all());
        return $responce;
    }

    public function getpaymentmode($user_id = '') {

        if (!empty($user_id)) {
            $payment_mode_result = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'available_payment_method'))->get();
            if (!empty($payment_mode_result) && $payment_mode_result->count() > 0) {
                $payment_mode = unserialize($payment_mode_result[0]->value);
                return $payment_mode;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function getalluserroles() {
        $roles = \DB::table('assigned_roles')->where('role_id', '<>', 3)->get(['user_id']);
        $user_id = array();
        foreach ($roles as $key => $value) {
            $user_id[] = $value->user_id;
        }
        return $user_id;
    }

    public function sendEmail(CreatelistingRequest $request) {
        $data = $request->all();

        if (!empty($data)) {

            try {
                $to = $data['email_to'];
                $from = $data['from_email'];
                $message = $data['email_message_business'];
                $datas = array('MESSAGE' => $message, 'FROM' => $from, 'EMAIL' => $to);
                $this->dispatch((new StylerZoneEmails($datas, 'emails.business-contact')));
//                Mail::send('emails.business-contact', $datas, function ($message) use ($datas) {
//                    $subject = "Business Query";
//                    $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
////                    $message->from($datas['FROM'], 'User');
//                    $message->to($datas['EMAIL'])->subject($subject);
//                });

                return response()->json(array(), 200);
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }
        }

        return response()->json(array(), 500);
    }

    public function searchBussinesses(CreatelistingRequest $request) {
        $name = $request->input("name");
        $company_name = DB::table("user_business")->select("business_name", "user_id")
                ->where('business_name', 'like', '%' . $name . '%')
                ->get();
        return json_encode($company_name);
    }

    public function listcheck() {

        $user_id = Auth::user()->id;
        $activeplan = Auth::user()->UserActiveSubscription()->plan_id;
        $return = 1;

        if ($activeplan == 2) {
            $listing = $this->listing->alllistingcount();
            if ($listing >= 3) {
                $return = 2;
            }
        }

        return $return;
    }

    public function allClassified(CreatelistingRequest $request) {

        $per_page = 3;
        $classified = $this->listing->getListingByTypePaginated($request->all(), 'classified', $per_page);

        $user_id = $payment_mode = '';
//        $this->listing->updateListingView($classified[0]->id, $classified[0]->user_id);
        $latestReview = $this->review->getLatestReview(16);
        if (isset($classified[0]->user->userBusiness->operating_hours)) {
            $classified[0]->user->userBusiness->operating_hours = json_decode($classified[0]->user->userBusiness->operating_hours);
        }

        $is_api = \Input::get('is_api');

        if ($is_api) {
            return response()->json($classified, 200);
        }
        $topbusiness = DB::select("SELECT users.id,users.rating,user_business.business_name,user_business.state,user_business.business_suburb,user_business.about,(SELECT COUNT(rating_reviews.id) FROM rating_reviews WHERE rating_reviews.from_user_id=users.id OR rating_reviews.to_user_id=users.id) AS 'total_reviews' FROM users inner join user_business on user_business.user_id=users.id ORDER BY users.rating DESC limit 3");
        return view('frontend.listing.classifiedsall', array('payment_mode' => $payment_mode, 'roles_id' => $this->getalluserroles()))
                        ->withRecords($classified)->withLatestreviews($latestReview)->withbusiness($topbusiness);
    }

    public function abnValidation(CreatelistingRequest $request) {
        $response = array();
        if ($request->has('abn') && $request->has('cname')) {
            $abn = str_replace(' ', '', $request->input('abn'));
            $company_name = strtolower(trim($request->input('cname')));
            $guid = getenv('ABN_GUID');
            $url = getenv('ABN_API_URL') . "abn=" . $abn . "&guid=" . $guid;
            $getresponse = file_get_contents($url);
            $getresponse = str_replace("callback(", "", $getresponse);
            $getresponse = \GuzzleHttp\json_decode(str_replace(")", "", $getresponse));

            $business_name = '';
            if (!empty($getresponse->BusinessName) && count($getresponse->BusinessName) > 0) {
                $business_name = $getresponse->BusinessName[0];
            } else {
                if (!empty($getresponse->EntityName)) {
                    $business_name = $getresponse->EntityName;
                }
            }
            $business_name = strtolower(trim($business_name));
            if ((!empty($business_name))) {
                if ($business_name == $company_name) {
                    $response = array(
                        "status" => "200",
                        "msg" => "Success",
                        "data" => $getresponse,
                    );
                } else {
                    $response = array(
                        "status" => "210",
                        "msg" => "Mismatch",
                        "data" => $getresponse,
                    );
                }
            } else {
                $response = array(
                    "status" => "220",
                    "msg" => "Invalid Abn",
                    "data" => $getresponse,
                );
            }
        } else {
            $response = array(
                "status" => "230",
                "msg" => "Fields are empty",
                "data" => ''
            );
        }
        return \GuzzleHttp\json_encode($response);
        exit;
    }

    public function getAllServices() {
        if (Auth::check()) {
            $services = Businessservices::where('author', Auth::user()->id)->get()->toArray();
            $reuslts = array(
                "status" => "200",
                "msg" => "Success",
                "data" => $services,
            );
        } else {
            $reuslts = array(
                "status" => "210",
                "msg" => "Auth not found.",
                "data" => "",
            );
        }
        return \GuzzleHttp\json_encode($reuslts);
    }

    public function getJobs(CreatelistingRequest $request) {
        $list = $this->listing->getJobDetails(Auth::user()->id);
        return response()->json($list, 200);
    }

    public function jobapplications($job_id, $type) {
        return $this->getApplicationsByType($job_id, $type);
    }

    public function jobApplicationsAll($type) {
        $jobs = Listing::where("user_id", Auth::user()->id)->where("type", "job")->get();
        $total_application = array();
        foreach ($jobs as $key => $job) {
            $data = $this->getApplicationsByType($job->id, $type, 1);
            if (!empty($data)) {
                $total_application = array_merge($total_application, $data);
            }
        }
        if ($type == 0) {
            $new_total_application = array();
            foreach ($total_application as $data) {
                if (isset($data['applicant_info']['id'])) {
                    $have_value = 0;
                    foreach ($new_total_application as $values) {
                        if ($data['applicant_info']['id'] == $values['applicant_info']['id']) {
                            $have_value = 1;
                            break;
                        }
                    }
                    if ($have_value == 0) {
                        $new_total_application[] = $data;
                    }
                }
            }
            $total_application = $new_total_application;
        }
        return array("status" => "200", "data" => $total_application, "msg" => "Successfully done");
    }

    // $callfrom 0: for listing call ,1: for all call
    public function getApplicationsByType($job_id, $type = 0, $callfrom = 0) {
        $lists = \App\Models\JobApplied\JobApplied::with(['applicantInfo', 'applicantInfo.profilepic', 'applicantInfo.userInfo']);
        $lists->where("listing_id", $job_id);
        if ($type == 0) {

        } else {
            $lists->where('applic_status', $type);
        }
        $lists = $lists->get()->toArray();
        $application = array();
        $info = array();
        foreach ($lists as $index => $list) {
            $application[$index] = $list;
            $user_meta = \DB::table('user_meta')->where(array('user_id' => $list['user_id'], 'key' => 'coverletter_resume'))->get();
            if (!empty($user_meta) && $user_meta->count() > 0) {
                $datas = unserialize($user_meta[0]->value);
                if (!empty($datas['resumeid'])) {
                    $assetinfos = \DB::table('assets')->where(array('id' => $datas['resumeid']))->get();

                    foreach ($assetinfos as $assetinfo) {
                        if (($assetinfo->ext == 'docx') or ( $assetinfo->ext == 'doc')) {
                            $image_url = 'images/MS_word_DOC_icon.png';
                        } elseif ($assetinfo->ext == 'pdf') {
                            $image_url = 'images/pdf-file-icon-hi.png';
                        } else {

                        }
                        $info = array(
                            'cover' => $datas['coverletter'],
                            'asset_id' => $assetinfo->id,
                            'file_name' => $assetinfo->name,
                            'file_path' => $assetinfo->path,
                            'file_url' => $image_url
                        );
                    }
                } else {
                    $info = array(
                        'cover' => isset($datas['coverletter']) ? $datas['coverletter'] : '',
                    );
                }
            }
            $application[$index]['cv_info'] = $info;
        }
        if ($callfrom == 1) {
            return $application;
        } else {
            return array("status" => "200", "data" => $application, "msg" => "Successfully done");
        }
    }

    public function candidateShortlist($job_id, $type = 1) {

        if ($job_id) {
            $job_applied = \App\Models\JobApplied\JobApplied::find($job_id);
            $job_applied->applic_status = $type;
            $job_applied->save();
            return array("status" => "200", "msg" => "Susccessfully Save");
        }
        return array("status" => "210", "msg" => "Something went wrong.Please try later!");
    }

    public function getjobsanalytic() {

        $return_array = array(
            "total_jobs" => \Illuminate\Support\Facades\DB::table('listing')->where('type', 'job')->where('user_id', Auth::user()->id)->count(),
            "total_applications" => \Illuminate\Support\Facades\DB::table('listing')
                    ->join('job_applied', 'job_applied.listing_id', '=', 'listing.id')->where('listing.user_id', Auth::user()->id)->where('listing.type', 'job')->groupBy('job_applied.id')->count(),
            "total_shortlisted" => \Illuminate\Support\Facades\DB::table('listing')
                    ->join('job_applied', 'job_applied.listing_id', '=', 'listing.id')->where('listing.user_id', Auth::user()->id)->where('listing.type', 'job')->where('job_applied.applic_status', '2')->count()
        );

        return \GuzzleHttp\json_encode($return_array);
    }

    public function changeJobStatus(CreatelistingRequest $request) {
        $list_id = $request->input('list_id');
        $status = $request->input('status');
        $job = \App\Models\Listing\Listing::find($list_id);
        $job->status = $status;
        $job->save();
        $type = "Deactivated";
        if ($status == 1) {
            $type = "Activated";
        }
        return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Successfully  " . $type));
    }

    public function AllCourses(CreatelistingRequest $request) {



        if (Auth::check()) {
            $services = \App\Models\BusinessCourses\BusinessCourses::where('user_id', Auth::user()->id)->get()->toArray();
            $reuslts = array(
                "status" => "200",
                "msg" => "Success",
                "data" => $services,
            );
        } else {
            $reuslts = array(
                "status" => "210",
                "msg" => "Auth not found.",
                "data" => "",
            );
        }
        return \GuzzleHttp\json_encode($reuslts);
    }

    public function testlisting($user_id) {
        echo "i am here";
        echo "<pre>";
        $deals = $this->listing->getListingByTypeWidget('deal', 99999, $user_id);
        print_r($deals);
        exit;
    }

    public function marketplace() {
        return view('frontend.marketplace.marketplace');
    }
    public function getServiceProviderByName($query){        
       $result= $this->listing->getServiceProviderByName($query);                        
       return response()->json($result, 200);
    }
}
