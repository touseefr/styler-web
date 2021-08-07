<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Listing\Listing;
use App\Businessservices;
use App\Http\Requests\Request as RequestsRequest;
use App\Repositories\Frontend\Categories\CategoriesContract;
use App\Repositories\Frontend\Listing\ListingContract;
use App\Jobs\StylerZoneEmails;
use App\Team;
use App\Models\Assets\Assets;
use App\Repositories\Frontend\Assets\EloquentAssetsRepository;
use App\User;
use DB;


class SpListingController extends Controller {

    protected $categories;

    function __construct(CategoriesContract $categories, ListingContract $listing) {
        $this->categories = $categories;
        $this->listing = $listing;
    }

    public function getListingList(Request $request) {
        $listingType = $request->input('listingType');
        $sp_id = $request->input('spId');
        $returnListing = array("status" => "210", "msg" => "listypeType and user id are required.", "data" => []);
        if ($listingType && $sp_id) {
            $q = Listing::query()
                    ->with('locations')
                    ->with('assets')
                    ->with('categories')
                    ->with('getAllCourses');
            // $q->OfTypeIn(array('classified','deal','businessforsale','job'));
            $q->OfTypeIn(array($listingType));
            $listingData = $q->where('user_id', $sp_id)
                    ->orderBy('id', 'desc')
                    ->paginate('10');
            if ($listingData->count() > 0) {
                $returnListing = array("status" => "200", "msg" => "Successfully done.", "data" => $listingData);
            } else {
                $returnListing = array("status" => "210", "msg" => "No Record found.", "data" => []);
            }
        }
        // echo "<pre>";
        // print_r($listingData);
        return $returnListing;
    }

    public function getServicesList(Request $request) {

        $reuslts = array(
            "status" => "210",
            "msg" => "Not Authorized",
            "data" => [],
            "categories" => []
        );
        $categories = array();
        if ($request->has('spId')) {
            $sp_id = $request->input('spId');
            $services = Businessservices::where('author', $sp_id)->get()->toArray();
        }
        if ($request->has('catType')) {
            $type = $request->input('catType');
            $parent='1';
            if ($type == 'business' || $type == 'deal') {
                $type = 'service';
            }elseif($type == 'classified' || $type == 'job'){
                $results = $this->categories->getAll($type, null);
                $parent = $results[0]->id;
            }
            if($type == 'gallery'){
                $categories = $this->categories->getAll('gallery', 4);
            }else{
                $categories = $this->categories->getAll($type, $parent);
            }
        }
        if($type=="job"){
            $results = $this->categories->getAll('posttitle',null);
            $parent = $results[0]->id;
            $posttitle = $this->categories->getAll('posttitle', $parent);
            $results = $this->categories->getAll('service',null);
            $parent = $results[0]->id;
            $job_services = $this->categories->getAll('service', $parent);
        }else{
            $job_services = array();
            $posttitle = array();
        }
        $FetchData=array();
        if($request->has('id') && !empty($id=$request->input('id'))){
            if($type=='meettheteam')
            {
                $FetchData =   $this->fetchTheTeam($id,$request->input('spId'));
            }elseif($type=='gallery')
            {
                // $FetchData =   $this->fetchTheTeam($id,$request->input('spId'));
            }
            else{
                $FetchData = $this->listing->findOrThrowException($id);
            }

        }
        if ($services || $categories) {
            $reuslts = array(
                "status" => "200",
                "msg" => "Success",
                "data" => $services,
                "categories" => $categories,
                "job_services" =>$job_services,
                "posttitle" =>$posttitle,
                "fetchData"=>$FetchData
                        );
        }
        return $reuslts;
    }
    public function fetchTheTeam($teammember_id,$user_id){
        $team_members = \DB::table('team_members')->where(array('id' => $teammember_id, 'owner_id' => $user_id))->get();
        $args=array();
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
        return $args;
    }
    public function getSubCategories(Request $request) {
        if ($request->input('parent_cat') && $request->input('catType')) {
            $type = $request->input('catType');
            $parent = $request->input('parent_cat');
            if ($type == 'business' || $type == 'deal') {
                $type = 'service';
            }
            $results = $this->categories->getAll($type, $parent);
            return array("status" => "200", "msg" => "Successfully done.", "subCategories" => $results);
        }
    }

    public function saveListing(Request $request) {
        $data=$request->all();
        $parameters['data']=(Array) json_decode($data['data']);
        $parameters['type']=$data['type'];
        $parameters['sp_id']=$data['sp_id'];

        $assets= $this->updateprofile($data);
        $parameters['data']['flowFiles']=array($assets->id);
        // return json_encode(array("data"=>$parameters));
        // exit;
        // $parameters=$request->all();
        $services=array();
        if(count($parameters['data']['services'])>0){
        foreach($parameters['data']['services'] as $key=>$value){
            $services[$key]=(array) json_decode($value);
        }
        $parameters['data']['services']=$services;
        }
        $list = $this->listing->create($parameters);
        $listtype = array(
            "classified" => "classifieds",
            "deal" => "deals",
            "job" => "jobs",
            "businessforsale" => "business",
        );
//        $data = $request->all();
//        $data['business_email'] = Auth::user()->userBusiness->business_email;
//        $data['username'] = Auth::user()->name;
//        $data['url'] = url($listtype[$request->input('type')] . "?id=" . base64_encode($list->id));
//        $this->dispatch((new StylerZoneEmails(['business_name' => Auth::user()->UserBusiness->business_name, 'list_id' => base64_encode($list->id), 'data' => $data, 'id' => base64_encode(Auth::user()->id)], 'emails.listing.create')));
        return response()->json($list, 200);
    }

public function updateListing($Lid,Request $request){
    $data=$request->all();
    $parameters=(Array) json_decode($data['data']);
    $parameters['type']=$data['type'];
    $parameters['sp_id']=$data['sp_id'];
    $assets= $this->updateprofile($data);
    $parameters['flowFiles']=$assets->id;
    if($assets->id){
        DB::table('listing_assets')->where('listing_id',$Lid)->Update(array('asset_id'=>$assets->id));
    }
    $services=array();
    if(count($parameters['services'])>0){
    foreach($parameters['services'] as $key=>$value){
        $services[$key]=(array) json_decode($value);
    }
    $parameters['services']=$services;
    }
    $list = $this->listing->update($Lid,$parameters);
    return response()->json($list, 200);

}




    public function fetchSpTeam($sp_id){
       $user_id=$sp_id;
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
                }
            }
        }
        return response()->json(array("status"=>"200","msg"=>"Successfully Done","data"=>$args), 200);

    }
    public function fetchSpGallery($sp_id){

        $user_meta = \DB::table('user_meta')->where(array('user_id' => $sp_id, 'key' => 'usergallery'))->get();

        $images_info = '';
        $checkassetavailblae = 0;
        $user_meta_array = array();

        if (count($user_meta->toArray()) > 0) {
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
                        if ($assets) {
                            foreach ($assets as $asset) {
                                $images_info[] = array(
                                    'asset_id' => $asset->id,
                                    'image_name' =>  $asset->name,
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
                $user_meta = \DB::table('user_meta')->update(["value" => serialize($user_meta_array)])->where(array('user_id' => $sp_id, 'key' => 'usergallery'));
            }
            $collection = collect($images_info)->sortBy('asset_id');
        }
        return response()->json(array("status"=>"200","msg"=>"Successfully Done","data"=>$images_info), 200);
    }

    public function saveTeamMember(Request $request){
        $response=array();
        $request_data=$request->all();
        // $request->input('owner_id');
        // return json_encode(array("id"=>$request_data));
        //  exit;
        $data=(Array)json_decode($request_data['Formdata']);
        $assetsIs = $this->updateprofile($request_data);
        if($assetsIs){
            $args = array('owner_id' => $data['owner_id'], 'member_name' =>$data['member_name'], 'designation' => $data['designation'], 'about' => $data['about'], 'image_id' =>$assetsIs->id);
            if(Team::create($args)){
                $response=array("status"=>"200","msg"=>"Successfully Save Data");
            }else{
                $response=array("status"=>"210","msg"=>"SomeThing went Wrong Please try again later.");
            }
    }else{
        $response=array("status"=>"210","msg"=>"SomeThing went Wrong Please try again later.");
    }
        return response()->json($response);
    }
    public function updateTeamMember($team_id,Request $request){
        $response=array();
        $request_data=$request->all();
        // return response()->json($request_data);
        $data=(Array)json_decode($request_data['Formdata']);
        $assetsIs = $this->updateprofile($request_data);
            if($assetsIs){
                $args = array(
                    'owner_id' => $data['owner_id'],
                    'member_name' =>$data['member_name'],
                    'designation' => $data['designation'],
                    'about' => $data['about'],
                    'image_id' =>$assetsIs->id);

                \DB::table('team_members')->where('id', $team_id)->update($args);

                $response=array("status"=>"200","msg"=>"Successfully Update.");
            }else{
                $response=array("status"=>"210","msg"=>"SomeThing went Wrong Please try again later.");
            }
        return response()->json($response);
    }

    public function updateprofile($img_object)
    {

        try {
            if ($img_object != "") {
                $file = $img_object['profile_pic'];
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(
                    public_path() . '/assets/user/large/',
                    $fileName
                );
                $assets = new Assets();
                $assets->name = $fileName;
                $assets->path = 'assets/user/large/';
                $assets->ext = $file->getClientOriginalExtension();
                $assets->save();
                return  $assets;
            }

        } catch (Exception $e) {
            return array("status" => "210", "msg" => $e->getMessage(),);
        }
    }

    public function saveGallery(Request $request){
         $data=$request->all();
        //  return json_encode($data);
         $data['Formdata']=(Array) json_decode($data['Formdata']);
        //  $user_id = $data['Formdata']['owner_id'];
        //  return json_encode($user_id);
        //  exit;
        $user_id = $data['owner_id'];
        $user_id = $data['Formdata']['owner_id'];
        $category = $data['Formdata']['category'];
        $imagetitle = $data['Formdata']['imagetitle'];
        $assets=$this->updateprofile($data);
        $imgid = $assets->id;
        // print_r($imgid);
        // exit;
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

                DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->update(['value' => serialize($old_images)]);
            } else {
                DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'usergallery', 'value' => serialize($args)]);
            }
        }
        return json_encode(array("status"=>"200","msg"=>"Succesfully Done."));
    }

    public function deleteListing(Request $request)
    {
        $id=$request->input('lid');
        $type=$request->input('type');
        if($type=="meettheteam"){
            if($id){
                $team_members = DB::table('team_members')->where(array('id' => $id))->get();
                foreach ($team_members as $team_member) {
                    if (!empty($team_members->image_id)) {
                        $assetsss = DB::table('assets')->where(array('id' => $team_member->image_id))->get();
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
                DB::table('team_members')->where(array('id' => $id))->delete();
               return response()->json(array("status"=>"200","msg"=>"Team member Successfuly deleted.","data"=>[]), 200);
           }else{
               return response()->json(array("status"=>"210","msg"=>"Something went wrong please try again later.","data"=>[]), 200);
           }
        }elseif($type=="gallery"){
            $cat_id=$request->input('cat_id');
            $user_id = $request->input('spId');
            $user_meta = DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();
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
                return response()->json(array("status"=>"200","msg"=>"Gallery Successfuly deleted.","data"=>[]), 200);
            }else{
                return response()->json(array("status"=>"210","msg"=>"Something went wrong please try again later.","data"=>[]), 200);
            }

        }else{
        if($id){
             $list = $this->listing->delete($id);
            return response()->json(array("status"=>"200","msg"=>"Listing Successfuly deleted.","data"=>$list), 200);
        }else{
            return response()->json(array("status"=>"210","msg"=>"Something went wrong please try again later.","data"=>$list), 200);
        }
    }
    }
}