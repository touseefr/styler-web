<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Pages\GetPageRequest;
use App\Http\Requests\Frontend\User\PaymentsRequest;
use App\Media;
use App\Models\Access\User\User;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Repositories\Frontend\User\UserContract;
//use App\Repositories\Frontend\User\UserContract;
use App\Team;
use Auth;
use DB;
use Flow\Config as FlowConfig;
use Flow\File as FlowFile;
use Flow\Request as FlowRequest;
use Illuminate\Http\Request;
use Image;
use Input;
use Omnipay\Omnipay;
use Redirect;
use Session;
use URL;
use App\Booking;
use App\Item;

/**
 * Class DashboardController
 * @package App\Http\Controllers\Frontend
 */
class DashboardController extends Controller {

    /**
     * [$user description]
     * @var [type]
     */
    public function __construct(UserContract $user, AssetsContract $assets) {
        $this->user = $user;
        $this->assets = $assets;
    }

    /**
     * @return mixed
     */
    public function index(PaymentsRequest $request) {
        if (Auth::user()->roles->first()->name == 'Employee') {
            return redirect('/');
        }

        if (Session::has('booking')) {
            return redirect(URL('booknow'));
        }
        $banner_path = 'images/listing-pg-banner.png';
//        echo "<pre>";
        if (Auth::user()->UserMeta) {
            $user_meta = Auth::user()->UserMeta->where('key', 'userBanner')->first();
            if ($user_meta) {
//               $user_meta=$user_meta->toArray();
                $banner_path = $user_meta->value;
            }
        }
//        echo $banner_path;
//        exit;
//
        return view('frontend.user.dashboard')->withUser(auth()->user())->withBannerpath($banner_path);
    }

    /**
     * @return mixed
     */
    public function dashboard(PaymentsRequest $request) {
        return Redirect::to('./account');
    }

    public function dopayments(PaymentsRequest $request) {
        $request->all()['packageId'];
        $packageDetail = $this->user->getPackagedetail($request->all());
        //echo "<pre>";
        //print_r($packageDetail);die;
        $gateway = Omnipay::create('PayPal_Express');
        $gateway->setUsername('k.kiran305-facilitator_api1.gmail.com');
        $gateway->setPassword('1365828284');
        $gateway->setSignature('AFcWxV21C7fd0v3bYYYRCpSSRl31AasZtD5hUjMXbolh2nZBsHjcGaoI');
        $gateway->setTestMode(true);
        $params = array(
            'cancelUrl' => URL::to('/'),
            'returnUrl' => URL::to('/') . '/savepayments',
            'name' => $packageDetail->package_name,
            'description' => $packageDetail->package_name,
            'amount' => $packageDetail->price,
            'currency' => 'USD',
            'packageId' => $packageDetail->id,
        );
        Session::put('params', $params);
        Session::save();
        $transaction = $gateway->authorize($params);
        $response = $transaction->send();
        if ($response->isRedirect()) {
            // Yes it's a redirect.  Redirect the customer to this URL:
            $redirectUrl = $response->getRedirectUrl();
            return Redirect::to($redirectUrl);
        }
        //echo $redirectUrl;
        /* echo "<pre>";
          print_r($gateway);
          print_r($request->all());
          echo "</pre>"; */
        die;
    }

    /**
     * @return mixed
     */
    public function savepayments(PaymentsRequest $request) {
        $gateway = Omnipay::create('PayPal_Express');
        $gateway->setUsername('k.kiran305-facilitator_api1.gmail.com');
        $gateway->setPassword('1365828284');
        $gateway->setSignature('AFcWxV21C7fd0v3bYYYRCpSSRl31AasZtD5hUjMXbolh2nZBsHjcGaoI');
        $gateway->setTestMode(true);
        $params = Session::get('params');
        //echo $params['packageId'];die;
        $response = $gateway->completePurchase($params)->send();
        $paypalResponse = $response->getData(); // this is the raw response object
        if (isset($paypalResponse['PAYMENTINFO_0_ACK']) && $paypalResponse['PAYMENTINFO_0_ACK'] === 'Success') {
            $this->user->savepaymentsDetail($params);
            return Redirect::to('/account#/settings/payments_methods');
        } else {

        }
        die;
    }

    /*
     * * Team Members
     */

    public function team_members() {
        $team_members = Team::where('owner_id', Auth::user()->id)->get();
        return view('frontend.team.teams')->with(array('team_members' => $team_members));
    }

    /*
     * * Add new team member
     */

    public function add_team_member() {
        return view('frontend.team.add_new');
    }

    /*
     * * Save new team member
     */

    public function save_team_member() {
        $media_sizes = Media::image_sizes();

        $member_image = Input::file('upload_photo');
        $media_path = Media::media_path();
        if ($member_image) {
            $mime = $member_image->getMimeType();
            $ext = explode('/', $mime);
            $uid = time() . uniqid();
            $name = $uid . '.' . $ext[1];

            $size = $member_image->getSize();
            $size = round(($size / 1024), 2);
            $size = $size . ' kb';

            $path = Media::public_media_path();

            $orig_img_url = $path . $uid . '.' . $ext[1];
            $member_image->move($path, $name);
            chmod($orig_img_url, 0777);
            foreach (@$media_sizes as $key => $val) {
                $img = Image::make(url() . '/' . $media_path . '' . $name . '');

                $img->resize($val['w'], $val['h']);
                $cropped_img_url = $path . '' . $uid . '-' . $val['w'] . '*' . $val['h'] . '.' . $ext[1] . '';
                $img->save($cropped_img_url, 100);
                $cropped_sizes[$key] = $media_path . $uid . '-' . $val['w'] . '*' . $val['h'] . '.' . $ext[1] . '';
            }
            $cropped_sizes['full'] = $media_path . $uid . '.' . $ext[1] . '';
            $media = Media::create([
                        'file_name' => $name,
                        'mime_type' => $mime,
                        'sizes' => serialize($cropped_sizes),
                        'file_size' => $size,
            ]);
        }

        $args = array('owner_id' => Auth::user()->id, 'member_name' => Input::get('member_name'), 'designation' => Input::get('designation'), 'about' => Input::get('about'), 'image_id' => $media->id);

        if (Team::create($args)) {
            return redirect('account/team-members/add')->with(array('type' => 'success', 'message' => 'Member has been added successfully!'));
        } else {
            return redirect('account/team-members/add')->with(array('type' => 'error', 'message' => 'Member could not be added!'));
        }
    }

    /*
     * * Edit team member
     */

    public function edit_team_member($id) {
        $team = Team::find($id);
        return view('frontend.team.edit')->with(array('team' => $team));
    }

    /*
     * * Update team member
     */

    public function update_team_member($id) {
        //print_r(Input::all());
        $team = Team::find($id);
        $team->owner_id = Auth::user()->id;
        $team->member_name = Input::get('member_name');
        $team->designation = Input::get('designation');
        $team->about = Input::get('about');
        $media_sizes = Media::image_sizes();

        $member_image = Input::file('upload_photo');
        $media_path = Media::media_path();
        if ($member_image) {
            Media::delete_media($team->image_id);
            $mime = $member_image->getMimeType();
            $ext = explode('/', $mime);
            $uid = time() . uniqid();
            $name = $uid . '.' . $ext[1];

            $size = $member_image->getSize();
            $size = round(($size / 1024), 2);
            $size = $size . ' kb';

            $path = Media::public_media_path();

            $orig_img_url = $path . $uid . '.' . $ext[1];
            $member_image->move($path, $name);
            chmod($orig_img_url, 0777);
            foreach (@$media_sizes as $key => $val) {
                $img = Image::make(url() . '/' . $media_path . '' . $name . '');

                $img->crop($val['w'], $val['h']);
                $cropped_img_url = $path . '' . $uid . '-' . $val['w'] . '*' . $val['h'] . '.' . $ext[1] . '';
                $img->save($cropped_img_url, 100);
                $cropped_sizes[$key] = $media_path . $uid . '-' . $val['w'] . '*' . $val['h'] . '.' . $ext[1] . '';
            }
            $cropped_sizes['full'] = $media_path . $uid . '.' . $ext[1] . '';
            $media = Media::create([
                        'file_name' => $name,
                        'mime_type' => $mime,
                        'sizes' => serialize($cropped_sizes),
                        'file_size' => $size,
            ]);
            $team->image_id = $media->id;
        }

        if ($team->save()) {
            return redirect('account/team-members/edit/' . $id)->with(array('type' => 'success', 'message' => 'Member has been updated successfully!'));
        } else {
            return redirect('account/team-members/edit/' . $id)->with(array('type' => 'success', 'message' => 'Member could not be updated!'));
        }
    }

    /*     * ***    Delete team Member new function ******* */

    public function DeleteTeamMember($id) {
        $user_id = Auth::user()->id;
        $team_members = \DB::table('team_members')->where(array('id' => $id, 'owner_id' => $user_id))->get();
        foreach ($team_members as $team_member) {
            if (!empty($team_members->image_id)) {
                $assetsss = \DB::table('assets')->where(array('id' => $team_member->image_id))->get();
                foreach ($assetsss as $asset) {
                    $destination = public_path() . $asset->path . $asset->name;
                    if (file_exists($destination)) {
                        unlink($destination);
                        unlink(public_path() . $asset->path . 'thumb_medium_' . $asset->name);
                        unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
                    }
                }
            }
        }

        \DB::table('team_members')->where(array('id' => $id, 'owner_id' => $user_id))->delete();
    }

    /*     * ****************End ******************** */

    /*
     * * Delete team member
     */

    public function delete_team_member($id) {        
        $team = Team::find($id);
        Media::delete_media($team->image_id);
        if ($team->delete()) {
            return redirect('account/team-members')->with(array('type' => 'success', 'message' => 'Member has been deleted successfully!'));
        } else {
            return redirect('account/team-members')->with(array('type' => 'error', 'message' => 'Member could not be deleted!'));
        }
    }

    /*     * **************** Anguler routes for team **************************** */

    public function teamssave(GetPageRequest $request) {
//        print_r($request->all());
        //        exit;
        $args = array('owner_id' => Auth::user()->id, 'member_name' => $request->input('name'), 'designation' => $request->input('designation'), 'about' => $request->input('about'), 'image_id' => (int) $request->input('imgid'));
        Team::create($args);
    }

    /*
     * * Upload team image
     */

    public function uploadteamimg() {
        $config = new FlowConfig(array(
            'tempDir' => storage_path() . '/chunks_temp', //With write access
        ));
        $config->setDeleteChunksOnSave(false);
        $request = new FlowRequest();
        $file = new FlowFile($config, $request);
        $response = response()->json('', 200);
        $fileName = time() . '_' . $request->getFileName();
        $destination = public_path() . '/assets/team/large/' . $fileName;
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
            /* $user = $this->user->findOrThrowException(\Input::get('id'));
              if($user->profilepic){
              $destination = public_path().$user->profilepic->path.$user->profilepic->name;
              if(file_exists($destination)){
              unlink($destination);
              unlink(public_path().$user->profilepic->path.'thumb_small_'.$user->profilepic->name);
              unlink(public_path().$user->profilepic->path.'thumb_medium_'.$user->profilepic->name);
              }
              } */
            $fileInfo['name'] = $fileName;
            $fileInfo['path'] = '/assets/team/large/';
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

            $image = $this->assets->saveteampic($fileInfo, \Input::get('id'));
            $response = response()->json($image['id'], 200);
        }
        return $response;
    }

    private function imagesallow() {
        $ret = 1;
        $user_id = Auth::user()->id;
        $activeplan = Auth::user()->UserActiveSubscription()->plan_type;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
        if (count($user_meta) > 0) {
            $catnimages = unserialize($user_meta[0]->value);
            $total_images = 0;
            foreach ($catnimages as $index => $values) {
                $total_images = $total_images + count($values);
            }
            if (($activeplan == 0 || $activeplan == 1) && $total_images >= 4) {
                $ret = 0;
            } elseif ($activeplan == 1 && $total_images >= 6) {
                $ret = 2;
            } elseif ($activeplan == 2 && $total_images >= 15) {
                $ret = 3;
            }
        }
        return $ret;
    }

    public function usergalleryupload() {

        $allowimages_status = $this->imagesallow();

        if ($allowimages_status == 1) {
            $config = new FlowConfig(array(
                'tempDir' => storage_path() . '/chunks_temp', //With write access
            ));
            $config->setDeleteChunksOnSave(false);
            $request = new FlowRequest();
            $file = new FlowFile($config, $request);
            $response = response()->json('', 200);
            $fileName = time() . '_' . $request->getFileName();
            $destination = public_path() . '/assets/usergallery/large/' . $fileName;
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                error_log('Documento GET');
                if (!$file->checkChunk()) {
                    error_log('Documento GET2');
                    return response()->json('', 204);
                }
            } else {
//            $file_up = $request->getFile();
                //            if($file_up['size'] < 16000) {//32000
                //                return  response()->json('File size shoulde be 2kb minimum', 400);
                //            }
                //            echo '<pre>';
                //            print_r($_FILES['file']);
                //            exit;

                list($width, $height) = @getimagesize($_FILES['file']['tmp_name']);

                if (!$width || !$height) {
                    return response()->json('Error in file', 400);
                } else {
                    if ($width < 400 || $height < 200) {
                        return response()->json('Please upload larger image greater than 400X200', 400);
                    }
                }

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
                /* $user = $this->user->findOrThrowException(\Input::get('id'));
                  if($user->profilepic){
                  $destination = public_path().$user->profilepic->path.$user->profilepic->name;
                  if(file_exists($destination)){
                  unlink($destination);
                  unlink(public_path().$user->profilepic->path.'thumb_small_'.$user->profilepic->name);
                  unlink(public_path().$user->profilepic->path.'thumb_medium_'.$user->profilepic->name);
                  }
                  } */
                $fileInfo['name'] = $fileName;
                $fileInfo['path'] = '/assets/usergallery/large/';
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

                $image = $this->assets->saveusergallery($fileInfo, \Input::get('id'));
                $response = $image['id'];
//                $response = response()->json($image['id'], 200);
                $image_ids = $image['id'];
            }

            //$user->usergallery = $image_ids;
            //\DB::table('user_meta')->update(['user_id'=>$user_id,'key'=>'usergallery','value' => $image_ids]);
            //\DB::table('user_meta')->where(array('user_id'=>$user_id,'key'=>'usergallery'))->update(['user_id'=>$user_id,'key'=>'usergallery','value' => $image_ids]);
            return $response;
        } else {
            return response()->json($allowimages_status, 200);
        }
    }

    public function getmygallery() {

        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();

        $images_info = '';
        $checkassetavailblae = 0;
        $user_meta_array = array();

        if (count($user_meta->toArray()) > 0) {
            $assets_ids = unserialize($user_meta[0]->value);
//            print_r($assets_ids);
//            exit;
            $images_info = array();
            foreach ($assets_ids as $cat_id => $catimages) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();
                foreach ($catimages as $imgid => $imagtitle) {
                    $image_id = $imgid;
                    $image_title = $imagtitle['title'];
                    if (!empty($image_id)) {
//                        echo trim(strip_tags($image_id));
                        $assets = \DB::table('assets')->where(array('id' => trim(strip_tags($image_id))))->get();
                        if ($assets) {
                            foreach ($assets as $asset) {
                                $images_info[] = array(
                                    'asset_id' => $asset->id,
                                    'image_name' => 'thumb_medium_' . $asset->name,
                                    'image_path' => $asset->path,
                                    'image_title' => $image_title,
                                    'image_cat' => $cate_info[0]->name,
                                    'cat_id' => $cate_id,
                                );
                                $user_meta_array[$cat_id][$asset->id] = $imagtitle;
                            }
                        } else {
                            $checkassetavailblae = 1;
                        }
                    }
                }
            }
            if ($checkassetavailblae == 1) {
                echo $user_id;
                $user_meta = \DB::table('user_meta')->update(["value" => serialize($user_meta_array)])->where(array('user_id' => $user_id, 'key' => 'usergallery'));
            }
            $collection = collect($images_info)->sortBy('asset_id');
            //print_r($images_info);
            /* foreach($arg as $Image_id){
              $assets    = \DB::table('assets')->where(array('id'=>$imgid))->get();
              foreach($assets as $asset){
              $images_info[]=array(
              'asset_id'      =>    $asset->id,
              'image_name'  =>    'thumb_medium_'.$asset->name,
              'image_path'  =>    $asset->path,
              'image_title' =>    $imagetitle,
              'image_cat'      =>    $asset_id->category

              );
              }

              }
             */
        }
//        print_r(collect($images_info)->sortByDesc('asset_id'));
        //        exit;

        return response()->json($images_info, 200);
    }

    public function DeleteMygalleryImage($id, $cat_id) {

        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();

        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
            $assets_ids = @unserialize($user_meta[0]->value);

            unset($assets_ids[$cat_id][$id]);

            //$ramaining_asset_ids = array_diff($assets_ids,$deleteasset_id);

            $assetsss = \DB::table('assets')->where(array('id' => $id))->get();
            foreach ($assetsss as $asset) {
                $destination = public_path() . $asset->path . $asset->name;
                if (file_exists($destination)) {
                    unlink($destination);
                    unlink(public_path() . $asset->path . 'thumb_medium_' . $asset->name);
                    unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
                } else {

                }
            }
            \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->update(['value' => serialize($assets_ids)]);
            \DB::table('assets')->where(array('id' => $id))->delete();
        }
    }

    public function DeleteAsset($asset_id) {
        if ($asset_id) {
            $id = trim(strip_tags($asset_id));
            $assetsss = \DB::table('assets')->where(array('id' => $id))->get();
            if ($assetsss) {
                foreach ($assetsss as $asset) {
                    $destination = public_path() . $asset->path . $asset->name;
                    if (file_exists($destination)) {
                        unlink($destination);
                        unlink(public_path() . $asset->path . 'thumb_medium_' . $asset->name);
                        unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
                    } else {

                    }
                    \DB::table('assets')->where(array('id' => $id))->delete();
                }
                return response()->json(['status' => "200", "msg" => "Successfully Remove"], 200);
            } else {
                return response()->json(['status' => "210", "msg" => "No asset found..."], 210);
            }
        } else {
            return response()->json(['status' => "210", "msg" => "No asset found..."], 210);
        }
    }

    public function GetClassifiedcat() {
        $classifiedCats = \DB::table('categories')->where(array('type_code' => 'gallery', 'parent' => 4))->get();
        if (!empty($classifiedCats)) {
            foreach ($classifiedCats as $classifiedCat) {

                $args[] = array(
                    'id' => $classifiedCat->id,
                    'name' => $classifiedCat->name,
                );
            }
        }
        return response()->json($args, 200);
    }

    public function getaccountcats() {
        $classifiedCats = \DB::table('categories')->where(array('type_code' => 'classified', 'parent' => 2))->get();
        if (!empty($classifiedCats)) {

            foreach ($classifiedCats as $classifiedCat) {

                $args[] = array(
                    'id' => $classifiedCat->id,
                    'name' => $classifiedCat->name,
                );
            }
        }
        return response()->json($args, 200);
    }

    public function ctusergallery() {
        $user_id = Auth::User()->id;
        $category = Input::get('category');
        $imagetitle = Input::get('imagetitle');
        $imgid = trim(strip_tags(Input::get('imgid')));

        if (!empty($category) and ! empty($imgid)) {
            /* $args = array(
              'category'        =>    $category,
              'imagetitle'    =>    $imagetitle,
              'imgid'            =>    $imgid
              ); */

            $args[$category][$imgid] = array('title' => $imagetitle);

            //print_r(serialize($args));

            $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
            //$gallery_images[] = $image_ids;
            if (count($user_meta->toArray()) > 0) {
                /* $old_images = unserialize($user_meta[0]->value);
                  $total_images = array_merge($old_images,$args);
                  $images =  serialize($total_images);
                  \DB::table('user_meta')->where(array('user_id'=>$user_id,'key'=>'usergallery'))->update(['value' => $images]); */
                $old_images = $this->removeSpaceFromArray(@unserialize($user_meta[0]->value));
                /*                 * ** category same **** */

                /* if($old_images[$category]){

                  }
                  else{
                  $old_images[$category][$imgid] = array('title' => $imagetitle);
                  } */

                $old_images[$category][$imgid] = array('title' => $imagetitle);

                \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->update(['value' => serialize($old_images)]);
            } else {
                \DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'usergallery', 'value' => serialize($args)]);
            }
        }
    }

    /*     * *************Create video gallery************************* */

    public function videosallow() {
        $ret = 1;
        $user_id = Auth::user()->id;
        $activeplan = Auth::user()->UserActiveSubscription()->plan_type;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->get();
        if (count($user_meta) > 0) {
            $catnimages = unserialize($user_meta[0]->value);

            $total_images = 0;

            foreach ($catnimages as $index => $values) {
                $total_images = $total_images + count($values);
            }

            if ($activeplan == 2 && $total_images >= 5) {
                $ret = 0;
            } else if ($activeplan == 2 && $total_images >= 5) {
                $ret = 2;
            }
        }
        return $ret;
    }

    public function videogallery() {
        $videoallow_status = $this->videosallow();

        if ($videoallow_status == 1) {
            $user_id = Auth::User()->id;
            $category = Input::get('category');
            $videotitle = Input::get('videotitle');
            $videolink = Input::get('videolink');
            $video_info = explode('=', $videolink);
            $video_id = $video_info[1];
            if (!empty($category) and ! empty($videolink)) {
                $args[$category][$video_id] = array('title' => $videotitle, 'YouTubeLink' => $videolink);
                $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->get();

                if (isset($user_meta) && $user_meta->count() > 0) {
                    $old_video = @unserialize($user_meta[0]->value);
                    $old_video[$category][$video_id] = array('title' => $videotitle, 'YouTubeLink' => $videolink);
                    \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->update(['value' => serialize($old_video)]);
                } else {
                    \DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'videogallery', 'value' => serialize($args)]);
                }
            }
        }
        return response()->json($videoallow_status, 200);
    }

    public function getvideogallery() {
        $videos_info = array();
        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->get();
        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
            $video_infos = unserialize($user_meta[0]->value);

            foreach ($video_infos as $cat_id => $catvideos) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();

                foreach ($catvideos as $videoid => $videoinfo) {
                    $video_id = $videoid;
                    $video_title = $videoinfo['title'];
                    $video_link = $videoinfo['YouTubeLink'];
                    $video_embed_link = 'http://www.youtube.com/embed/' . $video_id;
                    if (!empty($video_id)) {
                        $videos_info[] = array(
                            'video_id' => $video_id,
                            'video_title' => $video_title,
                            'video_cat' => $cate_info[0]->name,
                            'cat_id' => $cate_id,
                            'video_emb_link' => $video_embed_link,
                        );
                    }
                }
            }
        }

//print_r($videos_info);
        return response()->json($videos_info, 200);
    }

    public function DeleteMyvideogallery($id, $cat_id) {

        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->get();

        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
            $videos_ids = @unserialize($user_meta[0]->value);
            unset($videos_ids[$cat_id][$id]);
            \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'videogallery'))->update(['value' => @serialize($videos_ids)]);
        }
    }

    public function teamcancelFile($id) {

        $assetsss = \DB::table('assets')->where(array('id' => $id))->get();
        foreach ($assetsss as $asset) {
            $destination = public_path() . $asset->path . $asset->name;
            if (file_exists($destination)) {
                unlink($destination);
                unlink(public_path() . $asset->path . 'thumb_medium_' . $asset->name);
                unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
            }
        }
        \DB::table('assets')->where(array('id' => $id))->delete();
    }

    public function getteammembers() {
        $user_id = Auth::User()->id;
        $teaminfos = \DB::table('team_members')->where(array('owner_id' => $user_id))->get();
        $args = array();
        if (isset($teaminfos) && $teaminfos->count() > 0) {
            foreach ($teaminfos as $teaminfo) {
                $assetinfos = \DB::table('assets')->where(array('id' => $teaminfo->image_id))->get();
                if (isset($assetinfos) && $assetinfos->count() > 0) {
                    foreach ($assetinfos as $assetinfo) {
                        $args[] = array(
                            'team_id' => $teaminfo->id,
                            'member_name' => $teaminfo->member_name,
                            'designation' => $teaminfo->designation,
                            'about' => $teaminfo->about,
                            'image_id' => $assetinfo->id,
                            'image_url' => $assetinfo->path . $assetinfo->name,
                        );
                       // dd('argsggg',$args[]);
                    }
                } else {
                    $args[] = array(
                        'team_id' => $teaminfo->id,
                        'member_name' => $teaminfo->member_name,
                        'designation' => $teaminfo->designation,
                        'about' => $teaminfo->about,
                        'image_id' => '',
                        'image_url' => 'images/user_pic.jpg',
                    );
                  //  dd("else",$args);
                }
            }
        }
        return response()->json($args, 200);
    }

   
    public function getcustomerbooking()
    {
        $user_id = Auth::User()->id;
        //echo $user_id;
        $b=Booking::with('customer')->with('services')->with('services.service')->where('user_id', $user_id)->get();
         //dd($b[33]->services[0]->service->title);
    //   foreach($b as $a){
    //       foreach($a->services as $z){
    //         echo $z->time ."<br>";  
    //       }
    //     }
        $args = array();
        if (isset($b) && $b->count() > 0) {
            foreach($b as $a){
                foreach($a->services as $z){
                  //  dd($z->service->title);
                   $startTime = $this->date_creator($z->time);
                   $endTime = $this->date_creator($z->end_time);
                //  dd($startTime);
            $args[] = array(
                'booking' => $a->id,
                'title' =>  (isset($z->service->title) ?$z->service->title : null),
                'customerName' => $a->customer->first_name. " " .$a->customer->last_name,
                'date' => $a->date,
                'stime' => $startTime,
                'etime' => $endTime,
                'status' => $a->status,
            );
           //  dd("args",$args);
        }
    }
    }
        return response()->json($args, 200);
 }
 public function date_creator($date) {
    return date('g:i A', strtotime(date('g:i A', strtotime($date))));
}

    public function myresumeupload() {

        $config = new FlowConfig(array(
            'tempDir' => storage_path() . '/chunks_temp', //With write access
        ));
        $assets = array();
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
            $image = $this->assets->saveusergallery($fileInfo, \Input::get('id'));
            $assets['asset_id'] = $image['id'];
            $assets['file_path'] = $image['path'];
            $assets['file_name'] = $image['name'];
            $assets['ext'] = $image['ext'];
            if ($assets['ext'] == 'pdf') {
                $assets['file_url'] = '/images/pdf-file-icon-hi.png';
            } else {
                $assets['file_url'] = '/images/MS_word_DOC_icon.png';
            }
            $response = json_encode(array("id" => $image['id'], "msg" => "success", "status", "200", "mycoverletter" => $assets));
        }
        return trim($response);
    }

    public function mycoverletterandresume() {
        $user_id = Auth::User()->id;
        $coverletter = Input::get('cover');
        $resumeid = Input::get('imgid');

        if (!empty($coverletter)) {
            if (!empty($resumeid)) {
                $args = array(
                    'coverletter' => $coverletter,
                    'resumeid' => $resumeid,
                );
            } else {
                $args = array(
                    'coverletter' => $coverletter,
                    'resumeid' => Input::get('asset_id'),
                );
            }

            $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->get();
            if (count($user_meta->toArray()) > 0) {
                \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->update(['value' => serialize($args)]);
            } else {
                \DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'coverletter_resume', 'value' => serialize($args)]);
            }
        } else {
            return response()->json('Errors', 400);
        }
        return response()->json('Successfully submitted', 200);
    }

    public function getcoverltrandresume() {
        $user_id = Auth::User()->id;
        $info = array();
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->get();
        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
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
                    $filenameis = explode('_', $assetinfo->name);
                    $info = array(
                        'cover' => $datas['coverletter'],
                        'asset_id' => $assetinfo->id,
                        'file_name' => $assetinfo->name,
                        'file_path' => $assetinfo->path,
                        'file_url' => $image_url,
                        'filenameis' => $filenameis[(count($filenameis) - 1)]
                    );
                }
            } else {
                $info = array(
                    'cover' => $datas['coverletter'],
                );
            }
        }
        return response()->json($info, 200);
    }

    public function existingclandresume() {
        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->get();
        $info = array(
            'cover' => '',
            'asset_id' => '-',
        );
        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
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
                        'fileName' => $assetinfo->name,
                        'file_path' => $assetinfo->path,
                        'file_url' => $image_url,
                    );
                }
            } else {
                $info = array(
                    'cover' => $datas['coverletter'],
                    'asset_id' => '-',
                );
            }
        } else {
            $info = array(
                'cover' => '',
                'asset_id' => '-',
            );
        }
        return response()->json($info, 200);
    }

    public function DeleteMyResumeFile($id) {

        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->get();

        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
            $coverletters = @unserialize($user_meta[0]->value);
            //print_r($coverletters);
            unset($coverletters['resumeid']);

            $assetsss = \DB::table('assets')->where(array('id' => $id))->get();
            foreach ($assetsss as $asset) {
                echo $destination = public_path() . $asset->path . $asset->name;
                if (file_exists($destination)) {
                    unlink($destination);
                    // unlink(public_path() . $asset->path . $asset->name);
                }
            }

            \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'coverletter_resume'))->update(['value' => serialize($coverletters)]);

            \DB::table('assets')->where(array('id' => $id))->delete();
        }
    }

    public function getteammemberbyid() {
        $teammember_id = $_GET['team_member_id'];
        $user_id = Auth::user()->id;
        $team_members = \DB::table('team_members')->where(array('id' => $teammember_id, 'owner_id' => $user_id))->get();
        //print_r($team_members);

        foreach ($team_members as $team_member) {
            $asset_id = $team_member->image_id;
            $image_id = '';
            $image_name = '';
            $image_path = '';
            if (!empty($asset_id)) {
                $asset_infos = \DB::table('assets')->where(array('id' => $asset_id))->get();

                foreach ($asset_infos as $asset_info) {
                    $image_id = $asset_info->id;
                    $image_name = $asset_info->name;
                    $image_path = $asset_info->path;
                }
            }
            $args = array(
                'member_id' => $team_member->id,
                'member_name' => $team_member->member_name,
                'designation' => $team_member->designation,
                'about' => $team_member->about,
                'image_id' => $image_id,
                'image_name' => $image_name,
                'image_path' => $image_path,
            );
        }
        return response()->json(array($args), 200);
    }

    public function teammemberpic($image_id, $member_id) {
        \DB::table('team_members')->where(array('id' => $member_id))->update(array('image_id' => 0));
        $assetsss = \DB::table('assets')->where(array('id' => $image_id))->get();
        foreach ($assetsss as $asset) {
            $destination = public_path() . $asset->path . $asset->name;
            if (file_exists($destination)) {
                unlink($destination);
                unlink(public_path() . $asset->path . 'thumb_medium_' . $asset->name);
                unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
            }
        }
        \DB::table('assets')->where(array('id' => $image_id))->delete();
    }

    public function uploadteammemberpic($image_id) {
        $assetsss = \DB::table('assets')->where(array('id' => $image_id))->get();
        foreach ($assetsss as $asset) {
            $destination = public_path() . $asset->path . $asset->name;
            if (file_exists($destination)) {
                unlink($destination);
                unlink(public_path() . $asset->path . 'thumb_medium_' . $asset->name);
                unlink(public_path() . $asset->path . 'thumb_small_' . $asset->name);
            }
        }
        \DB::table('assets')->where(array('id' => $image_id))->delete();
    }

    public function updateteammembersave(GetPageRequest $request) {
        $imgid = '';
        foreach ($request->all() as $data) {
            if (!$data['member_id']) {
                return response()->json([
                            'error' => [
                                'message' => 'Team member id does not exits',
                            ],
                                ], 422);
            }
            if (!empty($data['image_id'])) {
                $imgid = $data['image_id'];
            } elseif (!empty($data['imgid'])) {
                $imgid = $data['imgid'];
            } else {

            }
            $args = array(
                'member_name' => $data['member_name'],
                'designation' => $data['designation'],
                'about' => $data['about'],
                'image_id' => (int) ($imgid),
                'updated_at' => date("Y-m-d H:i:s"),
            );
        }

        \DB::table('team_members')->where('id', $data['member_id'])->limit(1)->update($args);
    }

    public function savepaymentmethods(Request $request) {

        $user_id = Auth::user()->id;
        $paypal = Input::get('paypal');
        $creditcard = Input::get('creditcard');

        if (!empty(Input::get('paypal'))) {
            $paypal = Input::get('paypal');
        } else if (empty(Input::get('paypal'))) {
            $paypal = 0;
        } else {

        }
        if (!empty(Input::get('creditcard'))) {
            $creditcard = Input::get('creditcard');
        } else if (empty(Input::get('creditcard'))) {
            $creditcard = 0;
        } else {

        }
        $args = array(
            'paypal' => (($request->has('paypal') && ($request->input('paypal') == true || $request->input('paypal') == "true")) ? $request->input('paypal') : 0),
            'creditcard' => (($request->has('creditcard') && ($request->input('creditcard') == true || $request->input('creditcard') == "true")) ? $request->input('creditcard') : 0),
        );

        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'available_payment_method'))->get();
        if ($user_meta->count() > 0) {
            \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'available_payment_method'))->update(['value' => serialize($args)]);
        } else {
            \DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'available_payment_method', 'value' => serialize($args)]);
        }
        return response()->json('Successfully submitted', 200);
    }

    public function getpaymentmethod() {
        $user_id = Auth::User()->id;
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'available_payment_method'))->get();
        if (!empty($user_meta) && count($user_meta->toArray()) > 0) {
            $datas = unserialize($user_meta[0]->value);
            if ($datas['paypal'] == 0) {
                $paypal = false;
            } else {
                $paypal = true;
            }
            if ($datas['creditcard'] == 0) {
                $creditcrd = false;
            } else {
                $creditcrd = true;
            }
            $args = array(
                'paypal' => $paypal,
                'creditcard' => $creditcrd,
            );
        } else {
            $args = array();
        }

        return response()->json($args, 200);
    }

    public function addGalleryLike() {
        $user_id = Input::get('user_id');
        $asset_id = Input::get('asset_id');

        $user_like = \DB::table('gallery_likes')->where(array('user_id' => $user_id, 'asset_id' => $asset_id))->get();
        if (count($user_like) == 0) {
            $data = array(
                'user_id' => $user_id,
                'asset_id' => $asset_id,
            );
            DB::table('gallery_likes')->insert($data);
            return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Successfully update."));
        } else {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Already Update."));
        }
    }

    public function changepackage(GetPageRequest $request) {
        $user_id = Auth::user()->id;
        $new_package_id = $request->input('new_plan_id');

        DB::table("user_subscription")->where('user_id', $user_id)
                ->update(['plan_status' => 0]);
        $id = DB::table('user_subscription')->insertGetId(
                ['user_id' => $user_id, 'plan_status' => 1, 'plan_id' => $new_package_id]
        );
        return $id;
    }

    public function confirmAccount() {

        $objuser = User::find(Auth::user()->id);
        $objuser->confirmed = 1;
        $objuser->save();
        return redirect('account');
    }

    public function wizardComplete() {
        try {
            Auth::user()->show_buiness_wizard = 1;
            Auth::user()->save();
            return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Business info successfully  update."));
        } catch (Mockery\Exception $e) {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Something went wrong.Please try later!"));
        }
    }

}
