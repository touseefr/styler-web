<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Businessservices;
use App\Review;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\SocialMediaList\CreatesocialmedialistRequest;
use App\Models\SocialMediaList\SocialMediaList;
use App\Repositories\Frontend\User\UserContract;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use App\Http\Requests\Frontend\User\UpdateProfileRequest;
use App\Http\Requests\Frontend\User\GetProfileRequest;
use App\Http\Requests\Frontend\User\AppointmentRequest;
use App\Http\Requests\Frontend\User\ApplyjobRequest;
use App\Models\Access\User\User;
use Flow\Config as FlowConfig;
use Flow\Request as FlowRequest;
use Flow\File as FlowFile;
use Flow\ConfigInterface;
use Flow\RequestInterface;
use Illuminate\Support\Facades\Auth;
use Image;
use DB;
use Mail;
use App\Models\JobApplied\JobApplied;

/**
 * Class ProfileController
 * @package App\Http\Controllers\Frontend
 */
class ProfileController extends Controller {

    /**
     * [$user description]
     * @var [type]
     */
    function __construct(UserContract $user, AssetsContract $assets) {
        $this->user = $user;
        $this->assets = $assets;
    }

    /**
     * @return mixed
     */
    public function index() {
        if (auth()->check()) {
            return response()->json($this->user->findUserFullDetail(auth()->id()), 200);
        } else {
            return response()->json([
                        'error' => [
                            'message' => 'Not allowed to access this url.'
                        ]
                            ], 422);
        }
    }

    function getvideogallery($user_id) {

        $videos_info = array();
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->get();

        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
            $video_infos = unserialize($user_meta[0]->value);

            foreach ($video_infos as $cat_id => $catvideos) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();


                foreach ($catvideos as $videoid => $videoinfo) {
                    $video_id = $videoid;
                    $video_title = $videoinfo['title'];
                    $video_link = (isset($videoinfo['YouTubeLink'])) ? $videoinfo['YouTubeLink'] : '';
                    $video_embed_link = 'http://www.youtube.com/embed/' . $video_id;
                    if (!empty($video_id)) {
                        $videos_info[] = array(
                            'video_id' => $video_id,
                            'video_title' => $video_title,
                            'video_cat' => $cate_info[0]->name,
                            'cat_id' => $cate_id,
                            'video_emb_link' => $video_embed_link
                        );
                    }
                }
            }
        }

        return $videos_info;
    }

    function getmygallery($user_id) {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();

        $images_info = array();
        if (count($user_meta->toArray()) > 0 && !empty($user_meta)) {
            $assets_ids = unserialize($user_meta[0]->value);
            foreach ($assets_ids as $cat_id => $catimages) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();


                foreach ($catimages as $imgid => $imagtitle) {
                    $image_id = $imgid;
                    $image_title = $imagtitle['title'];
                    if (!empty($image_id)) {
                        $assets = \DB::table('assets')->where(array('id' => $image_id))->get();
//print_r($assets);
                        foreach ($assets as $asset) {
                            $images_info[] = array(
                                'asset_id' => $asset->id,
                                'image_name' => 'thumb_medium_' . $asset->name,
                                'image_org' => $asset->name,
                                'image_path' => $asset->path,
                                'image_title' => $image_title,
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
     * @return mixed
     */
    public function profile(GetProfileRequest $request) {      
        $app_id = '';
        $show_more_button = 0;
        $request->merge([
            'id' => base64_decode($request->input('id')),
        ]);
        if (Auth::check() && $request->has('app_id')) {
            $app_id = $request->input('app_id');
            $objJobApplied = JobApplied::find($app_id);
            if (Auth::user()->id == $objJobApplied->jobServiceProvider->user_id) {
                $show_more_button = 1;
            }
        }
        $user = $this->user->getUserDetail($request->all());
        $user[0]['bannerpath'] = 'new_assets/images/profile-banner-bg.png';
        if ($user && $user[0] && $user[0]->UserMeta) {
            $user_meta = $user[0]->UserMeta->where('key', 'userBanner')->first();
            if ($user_meta) {
                $user[0]['bannerpath'] = $user_meta->value;
            }
        }
        $previous = User::where('users.id', '<', $user[0]->id)->join('assigned_roles', 'assigned_roles.user_id', '=', 'users.id')->where('assigned_roles.role_id', $user[0]->roles[0]->id)->max('users.id');
        $next = User::where('users.id', '>', $user[0]->id)->join('assigned_roles', 'assigned_roles.user_id', '=', 'users.id')->where('assigned_roles.role_id', $user[0]->roles[0]->id)->min('users.id');
        if (isset($user[0]->roles[0]) && ( $user[0]->roles[0]->name == 'Individual' || $user[0]->roles[0]->name == 'JobSeeker') || ($user[0]->roles[0]->name === "Employee")) {
            return view('frontend.user.profile.individualuser')->with(['show_more_button' => $show_more_button])->with(['app_id' => $app_id])->withRecords($user)->with('previous', $previous)->with('next', $next)->withBannerpath($user[0]['bannerpath']);
        } else {
            $userGallery = [];
            $user[0]['gallery'] = $this->getmygallery($user[0]->id);
            $video_gallery = $this->getvideogallery($user[0]->id);
            $user[0]['video_gallery'] = $video_gallery;
            $Businessservices = Businessservices::where('author', $user[0]->id)->get();
            $user[0]['business_services'] = $Businessservices;
            $reviews = Review::reviewWithreply($user[0]->id);
            $user[0]['reviewWithreply'] = $reviews;
            $user[0]['payment_integration_info'] = \Illuminate\Support\Facades\DB::table('user_meta')
                    ->where("key", "available_payment_method")
                    ->where("user_id", $user[0]->id)
                    ->get();
            return view('frontend.user.profile.index')->withRecord($user)->with('user_id', $request->input('id'))->with('previous', $previous)->with('next', $next);
        }
    }

    /**
     * @return mixed
     */
    public function rating(GetProfileRequest $request, ReviewsContract $review) {
        if (auth()->check()) {
            $review->saveRating($request->all());
            $rating = $review->getRating($request->all()['to']);
            $ratingSum = 0;
            foreach ($rating as $key => $value) {
                $ratingSum += $value['rating'];
            }
            if ($ratingSum) {
                $userrating = array('rating' => number_format($ratingSum / count($rating), 2));
            } else {
                $userrating = array('rating' => 0);
            }
            return response()->json($userrating, 202);
        } else {
            return response()->json([
                        'error' => [
                            'message' => 'Not allowed to access this url.'
                        ]
                            ], 422);
        }
    }

    /**
     * @return mixed
     */
    public function edit() {
        return view('frontend.user.profile.edit')
                        ->withUser(auth()->user());
    }

    /**
     * update user babis information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function update(UserContract $user, UpdateProfileRequest $request) {
        $user->updateProfile($request->all());
        return auth()->id();
    }

    public function updatesocialmedia(UserContract $user, CreatesocialmedialistRequest $request) {
        $return_array = array();
        $returnvals = (array) $request->all();

        $user_id = Auth::user()->id;
        foreach ($returnvals as $key => $values) {
            $return_array[] = array("user_id" => $user_id, "key" => $key, "value" => $values);
        }
        DB::table('user_social_accounts')
                ->where('user_id', Auth::user()->id)
                ->delete();

        DB::table('user_social_accounts')->insert($return_array);
        return response()->json($returnvals, 200);
    }

    /**
     * search for job seekers
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function jobseekers(GetProfileRequest $request) {
        if ($request->wantsJson()) {
            $result = $this->user->searchJobSeeker($request->all(), 1);
            return response()->json($result, 200);
        }
    }

    /**
     * search for all job seekers by parameters
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function getjobseekers(GetProfileRequest $request) {
//print_r($request->all());

        /* if ($request->wantsJson()) {
          $result = $this->user->searchJobSeeker($request->all(), 1);
          return response()->json($result, 200);
          } */

        $gender = '';
        $category = '';
        $location = '';
        $jobtitle = '';
        $jobtype = '';
        $cat_id = '';
        $location_id = '';
        foreach ($request->all() as $k => $v) {
            if ($k == 'categories') {
                $categories = Json_decode($v);

                foreach ($categories->cats as $cats) {
                    $cat_ids[] = $cats->id;
                }
            } else if ($k == 'locations') {
                $location = $v;
                $location = json_decode($location);
                $location_id = $location->id;
            } else if ($k == 'gender') {
                $gender = $v;
            } else if ($k == 'jobtitle') {
                $jobtitle = $v;
            } else if ($k == 'jobtype') {
                $jobtype = $v;
            } else {
                
            }
        }

        /* 	$query=\DB::table('user_info')->where('jobtitle','Like','%'.$jobtitle.'%');
          $query = is_null($gender) ? $query : $query->where('gender','=',''.$gender.'');
          $query = is_null($jobtype) ? $query : $query->where('jobtype','=',''.$jobtype.'');
          $user_info=$query->get(); */ /* -> join('contacts', 'users.id', '=', 'contacts.user_id') */

        /* if($jobtitle){
          $user_info=\DB::table('user_info')->where('jobtitle','Like','%'.$jobtitle.'%')->whereNotNull('gender','=','')->get();

          } */

        $query = \DB::table('user_info')->leftJoin('assigned_roles', function($join) {
                    $join->on('user_info.user_id', '=', 'assigned_roles.user_id');
                })->where('assigned_roles.role_id', '=', '4');
        if (!empty($jobtitle)) {
            $query = is_null($jobtitle) ? $query : $query->where('jobtitle', 'Like', '%' . $jobtitle . '%');
        }

        if (!empty($gender)) {
            $query = is_null($gender) ? $query : $query->where('gender', '=', '' . $gender . '');
        }
        if (!empty($cat_ids)) {
            foreach ($cat_ids as $cat_id) {
                $query = is_null($cat_id) ? $query : $query->where('cat_id', '=', '' . $cat_id . '');
            }
        }
        if (!empty($location_id)) {
            $query = is_null($location_id) ? $query : $query->where('suburb', '=', '' . $location_id . '');
        }

        if (!empty($jobtype)) {
            $query = is_null($jobtype) ? $query : $query->where('jobtype', '=', '' . $jobtype . '');
        }
        $user_infos = $query->get();
        foreach ($user_infos as $user_info) {
//echo'hhhhhh' .$user_info->user_id;
            $users = User::find($user_info->user_id);
            if (!empty($users['name'])) {
                $args[] = array(
                    'user_id' => $user_info->user_id,
                    'name' => $users['name'],
                    'jobtype' => $user_info->jobtype,
                    'jobtitle' => $user_info->jobtitle
                );
            }
        }

        if (!empty($args)) {
            return response()->json($args, 200);
        } else {
            $args = array();
            return response()->json($args, 200);
        }
    }

    /**
     * search for User | ServiceProvider and Distributer
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function getusers(GetProfileRequest $request) {
        if ($request->wantsJson()) {
            $result = $this->user->searchUser($request->all(), 1);
            return response()->json($result, 200);
        }
    }

    /**
     * update user business information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function updatebusiness(UserContract $user, UpdateProfileRequest $request) {
        $user->updateBusinessInfo($request->all());
// return response()->json($request->all());
        return auth()->id();
    }

    public function getuserjobs() {

        if (auth()->check()) {
            return response()->json($this->user->getUserJobs(auth()->id()), 200);
        } else {
            return response()->json([
                        'error' => [
                            'message' => 'Not allowed to access this url.'
                        ]
                            ], 422);
        }
    }

    /**
     * update user babic information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function updateindividualinfo(UserContract $user, UpdateProfileRequest $request) {
        $data = $user->updateindividualinfo($request->all());
        return json_encode(array('data' => $data));
    }

    /**
     * update user babic information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function bookappointment(UserContract $user, AppointmentRequest $request) {
        $appointment = $user->bookappointment($request->all());
        return response()->json($appointment, 200);
    }

    /**
     * update user babic information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function uploadprofilepic(AssetsContract $assets) {
        $config = new FlowConfig(array(
            'tempDir' => storage_path() . '/chunks_temp', //With write access
        ));
        $config->setDeleteChunksOnSave(false);
        $request = new FlowRequest();
        $file = new FlowFile($config, $request);
        $response = response()->json('', 200);
        $fileName = time() . '_' . $request->getFileName();
        $destination = public_path() . '/assets/user/large/' . $fileName;
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            error_log('Documento GET');
            if (!$file->checkChunk()) {
                error_log('Documento GET2');
                return response()->json('', 204);
            }
        } else {
            if ($file->validateChunk()) {
                $file->saveChunk();
                error_log('Documento VaLido !!!');
            } else {
                error_log('Documento INVALIDO');
// error, invalid chunk upload request, retry
                return response()->json('Error in chunck', 400);
            }
        }
        if ($file->validateFile() && $file->save($destination)) {
            $user = $this->user->findOrThrowException(\Input::get('id'));
            if ($user->profilepic) {
                $destination = public_path() . $user->profilepic->path . $user->profilepic->name;
                if (file_exists($destination)) {
                    unlink($destination);
                    unlink(public_path() . $user->profilepic->path . 'thumb_small_' . $user->profilepic->name);
                    unlink(public_path() . $user->profilepic->path . 'thumb_medium_' . $user->profilepic->name);
                }
            }
            $fileInfo['name'] = $fileName;
            $fileInfo['path'] = '/assets/user/large/';
            $fileInfo['ext'] = pathinfo($fileName, PATHINFO_EXTENSION);
// open an image file
            $org = public_path() . $fileInfo['path'] . $fileName;
            $thumb = public_path() . $fileInfo['path'] . 'thumb_small_' . $fileName;
            $thumb_medium = public_path() . $fileInfo['path'] . 'thumb_medium_' . $fileName;
            $img = Image::make($org);
            $img->resize(118, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $img->save($thumb);
            $img = Image::make($org);
            $img->resize(200, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $img->save($thumb_medium);

            $image = $assets->saveprofilepic($fileInfo, \Input::get('id'));
            $response = response()->json($fileInfo, 200);
        }
        return $response;
    }

    /**
     * update user babic information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function uploadVideo(AssetsContract $assets) {

        $config = new FlowConfig(array(
            'tempDir' => storage_path() . '/chunks_temp', //With write access
        ));
        $config->setDeleteChunksOnSave(false);
        $request = new FlowRequest();
        $file = new FlowFile($config, $request);
        $response = response()->json('', 200);
        $fileName = time() . '_' . $request->getFileName();
        $destination = public_path() . '/assets/user/video/' . $fileName;
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            error_log('Documento GET');
            if (!$file->checkChunk()) {
                error_log('Documento GET2');
                return response()->json('', 204);
            }
        } else {
            if ($file->validateChunk()) {
                $file->saveChunk();
                error_log('Documento VaLido !!!');
            } else {
                error_log('Documento INVALIDO');
// error, invalid chunk upload request, retry
                return response()->json('Error in chunck', 400);
            }
        }
        if ($file->validateFile() && $file->save($destination)) {
            $user = $this->user->findOrThrowException(\Input::get('id'));
            if ($user->profilevideo) {
                $destination = public_path() . $user->profilevideo->path . $user->profilevideo->name;
                if (file_exists($destination)) {
                    unlink($destination);
                }
            }

            $fileInfo['name'] = $fileName;
            $fileInfo['path'] = '/assets/user/video/';
            $fileInfo['ext'] = pathinfo($fileName, PATHINFO_EXTENSION);
            $image = $assets->saveVideo($fileInfo, \Input::get('id'));

            $response = response()->json($fileInfo, 200);
        }
        return $response;
    }

    /**
     * update user babic information
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function uploadResume() {

        $config = new FlowConfig(array(
            'tempDir' => storage_path() . '/chunks_temp', //With write access
        ));
        $config->setDeleteChunksOnSave(false);
        $request = new FlowRequest();
        $file = new FlowFile($config, $request);
        $response = response()->json('', 200);
        $fileName = time() . '_' . $request->getFileName();
        $destination = public_path() . '/assets/user/resume/' . $fileName;
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            error_log('Documento GET');
            if (!$file->checkChunk()) {
                error_log('Documento GET2');
                return response()->json('', 204);
            }
        } else {
            if ($file->validateChunk()) {
                $file->saveChunk();
                error_log('Documento VaLido !!!');
            } else {
                error_log('Documento INVALIDO');
// error, invalid chunk upload request, retry
                return response()->json('Error in chunck', 400);
            }
        }
        if ($file->validateFile() && $file->save($destination)) {
            $fileInfo['name'] = $fileName;
            $fileInfo['path'] = '/assets/user/resume/';
            $fileInfo['ext'] = pathinfo($fileName, PATHINFO_EXTENSION);
            $fileid = $this->assets->saveusergallery($fileInfo, \Input::get('id'));
            $fileInfo['img_id'] = $fileid['id'];
            $response = response()->json($fileInfo, 200);
        }
        return $response;
    }

    /**
     * Apply for job
     * @param UserContract $user
     * @param UpdateProfileRequest $request
     * @return mixed
     */
    public function applyJob(ApplyjobRequest $request) {
        $response = $this->user->applyJob($request->all());
        return response()->json($response, 200);
    }

    /**
     * delete logo | ServiceProvider and Distributer
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function deletelogo(GetProfileRequest $request, AssetsContract $assets) {
        if ($request->wantsJson()) {
            $user = $this->user->findOrThrowException(\Input::get('id'));
            $destination = public_path() . $user->profilepic->path . $user->profilepic->name;
            if (file_exists($destination)) {
                unlink($destination);
                unlink(public_path() . $user->profilepic->path . 'thumb_small_' . $user->profilepic->name);
                unlink(public_path() . $user->profilepic->path . 'thumb_medium_' . $user->profilepic->name);
            }
            $assets->deletelogo($user->profilepic->id, \Input::get('id'));
            return response()->json($user->profilepic->id, 200);
        }
    }

    /**
     * delete video | ServiceProvider and Distributer
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function deletevideo(GetProfileRequest $request, AssetsContract $assets) {
        if ($request->wantsJson()) {
            $user = $this->user->findOrThrowException(\Input::get('id'));
            if ($user->profilevideo) {
                $destination = public_path() . $user->profilevideo->path . $user->profilevideo->name;
                if (file_exists($destination)) {
                    unlink($destination);
                }
            }
            $assets->deleteVideo($user->profilevideo->id, \Input::get('id'));
            return response()->json($destination, 200);
        }
    }

    /**
     * get User Watch List
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function getwatchlist() {
        if (auth()->check()) {

            $data = DB::select("SELECT t1.id as watchlist_id, t1.item_id as listing_id, t1.watchtype,t1.created_at as watch_include_at, t2.* FROM `watch_list` t1 join listing t2 on(t1.item_id = t2.id) where t1.watchtype = 'listing' and t1.user_id = " . auth()->id() . " order by t1.created_at Desc");
            if ($data) {
                foreach ($data as $listing) {
//                    $assets = DB::select("SELECT t2.* FROM listing_assets t1 join assets t2 on(t1.asset_id = t2.id) WHERE listing_id = " . $listing->listing_id . "");
                    $assets = $this->getJobGalleryImages($listing->user_id);

                    if ($assets) {
                        $listing->assets = $this->getJobGalleryImages($listing->user_id);
                    }
// $listing->description= strip_tags(htmlspecialchars_decode($listing->description));
// $listing->description= $listing->description));
                }
            }
            return response()->json($data, 200);
        } else {
            return response()->json([
                        'error' => [
                            'message' => 'Not allowed to access this url.'
                        ]
                            ], 422);
        }
    }

    public function getJobGalleryImages($user_id) {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        $images_info = array();

        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
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

    /*
     * * remove watch list item
     */

    public function watchlistdelete($id, $watchtype) {
        $user_id = auth()->id();
        $watchlist_id = $id;
        \DB::table('watch_list')->where(array('id' => $watchlist_id, 'user_id' => $user_id))->delete();
    }

    /*
     * * get watch list of job seekers
     */

    public function getWatchListjobseeker() {
        if (auth()->check()) {

            $data = DB::select("SELECT  t1.id as watchlist_id, t2.id, t2.name, t3.about, t2.profile_pic FROM `watch_list` t1 join users t2 on(t1.item_id = t2.id) join user_info t3 on(t3.user_id = t2.id) where t1.watchtype = 'Job Seeker' and t1.user_id = " . auth()->id() . "");
//$args = array();
            if ($data) {
                foreach ($data as $jobseeker) {
                    if ($jobseeker->profile_pic) {
                        $asset = DB::select("select * from assets where id = {$jobseeker->profile_pic}");
                        $jobseeker->assets = $asset[0];
                    }
                }
            }
            return response()->json($data, 200);
        } else {
            return response()->json([
                        'error' => [
                            'message' => 'Not allowed to access this url.'
                        ]
                            ], 422);
        }
    }

    /**
     * sendemail | Individual and job seekers
     * @param UserContract $user
     * @param GetProfileRequest $request
     * @return mixed
     */
    public function sendemail(GetProfileRequest $request) {
        if ($request->wantsJson()) {
            return response()->json($this->user->SendEmailToJobseeker($request->all()), 200);
        }
    }

    public function contactme(GetProfileRequest $request) {

        if ($request->has('sendtoid')) {
            $user = array(
                "to" => $request->input('sendto'),
                "from" => $request->input('sendfrom'),
                "fromname" => $request->input('fromname'),
                "toname" => "",
                "subject" => "STYLE ZONE MESSAGE NOTIFICATION",
                "msg" => $request->input('senderMsg'),
            );
            try {
                Mail::send('emails.contactme', ['user' => $user], function ($m) use ($user) {
                    $m->from($user['from'], $user['fromname']);
                    $m->to($user['to'], $user['toname'])->subject($user['subject']);
                });
                $msg = "Message Send Contact You Soon!!";
            } catch (\Exception $e) {
                $msg = $e->getMessage();
            }
            return json_encode(array("status" => "200", "msg" => $msg));
        } else {
            return json_encode(array("status" => "210", "Id Not Found"));
        }
    }

    public function jobSeekerapplied(GetProfileRequest $request) {
        $job_applied = \Illuminate\Support\Facades\DB::table('job_applied')->insert([
            ['listing_id' => $request->input('listing_id'), 'user_id' => $request->input('user_id')],
        ]);
        return array("status" => "200", "msg" => "Successfully done.");
        exit;
    }

    public function BannerUploadImage(Request $request) {
        $return = array("status" => "210", "msg" => "Please try again Later");
        try {
            if (Auth::check()) {
                if ($request->hasFile('userbanner')) {
                    $file = $request->file('userbanner');
                    $destinationPath = 'assets/userBanners';
                    $user_id = Auth::user()->id;
                    $file_new_name = date("Ymdhis") . '_' . $file->getClientOriginalName();
                    $file->move($destinationPath, $file_new_name);
                    $userData = \Illuminate\Support\Facades\DB::table('user_meta')->where('user_id', $user_id)->where('key', 'userBanner')->first();
                    if ($userData) {
                        if (file_exists(public_path() . '/' . $userData->value)) {
                            @unlink(trim(public_path() . '/' . $userData->value));
                        }
                        \Illuminate\Support\Facades\DB::table('user_meta')->where('user_id', $user_id)->where('key', 'userBanner')->delete();
                        \Illuminate\Support\Facades\DB::table('user_meta')->insert(
                                ['user_id' => $user_id, 'key' => 'userBanner', 'value' => $destinationPath . '/' . $file_new_name, 'created_at' => date('Y-m-d h:i:s')]
                        );
                    } else {
                        \Illuminate\Support\Facades\DB::table('user_meta')->insert(
                                ['user_id' => $user_id, 'key' => 'userBanner', 'value' => $destinationPath . '/' . $file_new_name, 'created_at' => date('Y-m-d h:i:s')]
                        );
                    }
                    $return = array("status" => "200", "msg" => "Successfully Save.", "image" => $destinationPath . '/' . $file_new_name);
                } else {
                    $return = array("status" => "210", "msg" => "Invalid File.Please try again later.");
                }
            } else {
                $return = array("status" => "210", "msg" => "Session is Expired.");
            }
        } catch (Exception $e) {
            $return = array("status" => "210", "msg" => "Exception Something went wrong.");
        }
        return trim(\GuzzleHttp\json_encode($return));
    }

}
