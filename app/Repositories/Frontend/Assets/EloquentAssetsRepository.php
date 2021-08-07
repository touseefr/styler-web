<?php namespace App\Repositories\Frontend\Assets;

use App\Exceptions\GeneralException;
use App\Models\Assets\Assets;
use App\Repositories\Frontend\Assets\AssetsContract;
use App\Models\Access\User\User;
use App\Models\Listing\Listing;
use Illuminate\Support\Facades\DB;

/**
 * Class EloquentAssetsRepository
 * @package App\Repositories\Assets
 */
class EloquentAssetsRepository implements AssetsContract {

	/**
	 * [__construct description]
	 * @author Mohan Singh <mslogicmaster@gmail.com>
	 */
	public function __construct() {
	}

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 * @throws GeneralException
	 */
	public function findOrThrowException($id) {

		$assets = Assets::withTrashed()->find($id);
		if (!is_null($assets)) {
			return $assets;
		}

		throw new GeneralException('That asset does not exist.');
	}

/**
	 * @param $input
	 * @param $roles
	 * @param $permissions
	 * @return bool
	 * @throws GeneralException
	 * @throws UserNeedsRolesException
	 */
	public function create($input,$listingId="null") {
		$assets = new Assets();	
		$assets->name = $input['name'];
		$assets->path = $input['path'];
		$assets->ext = $input['ext'];
		$assets->save();
		if($listingId!="null"){
			$assets->Listing()->attach($listingId);
		}
		return $assets;

		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}

	/**
	 * @param $input
	 * @param $roles
	 * @param $permissions
	 * @return bool
	 * @throws GeneralException
	 * @throws UserNeedsRolesException
	 */
	public function saveprofilepic($input,$userId="null") {
		if($userId!="null"){
			$assets = new Assets();	
			$assets->name = $input['name'];
			$assets->path = $input['path'];
			$assets->ext = $input['ext'];
			$assets->save();
			$user = User::find($userId);
			$assets->userPicture()->save($user);
		}
		return $assets;

		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}
	
	public function saveteampic($input,$teamId="null") {
		/* if($teamId!="null"){ */
			$assets = new Assets();	
			$assets->name = $input['name'];
			$assets->path = $input['path'];
			$assets->ext = $input['ext'];
			$assets->save();
			//$user = User::find($userId);
			//$assets->userPicture()->save($user);
		/* } */
		return $assets;

		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}
		public function saveusergallery($input,$userId="null") {
		/* if($teamId!="null"){ */
			$assets = new Assets();	
			$assets->name = $input['name'];
			$assets->path = $input['path'];
			$assets->ext = $input['ext'];
			$assets->save();
			//$user = User::find($userId);
			//$assets->userPicture()->save($user);
		/* } */
		return $assets;

		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}
	
	
	
	/**
	 * @param $input
	 * @param $roles
	 * @param $permissions
	 * @return bool
	 * @throws GeneralException
	 * @throws UserNeedsRolesException
	 */
	public function deletelogo($id,$userId="null") {
		$asset = $this->findOrThrowException($id, true);
		if($userId!="null"){
			$user = User::find($userId);
			$user->profile_pic = null;
			$user->save();
		}
		try {
			$asset->forceDelete();
		} catch (\Exception $e) {
			throw new GeneralException($e->getMessage());
		}
	}
	
	
	/**
	 * @param $input
	 * @param $roles
	 * @param $permissions
	 * @return bool
	 * @throws GeneralException
	 * @throws UserNeedsRolesException
	 */
	public function deleteVideo($id,$userId="null") {
		$asset = $this->findOrThrowException($id, true);
		if($userId!="null"){
			$user = User::find($userId);
			$user->video = null;
			$user->save();
		}
		//print_r($asset);die;
		try {
			$asset->forceDelete();
		} catch (\Exception $e) {
			throw new GeneralException($e->getMessage());
		}
		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}
	

	/**
	 * @param $input
	 * @param $roles
	 * @param $permissions
	 * @return bool
	 * @throws GeneralException
	 * @throws UserNeedsRolesException
	 */
	public function saveVideo($input,$userId="null") {
		if($userId!="null"){
			$assets = new Assets();	
			$assets->name = $input['name'];
			$assets->path = $input['path'];
			$assets->ext = $input['ext'];
			$assets->save();
			$user = User::find($userId);
			$assets->userVideo()->save($user);
		}
		return $assets;
		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}



	/**
	 * @param $id
	 * @param $input
	 * @param $roles
	 * @return bool
	 * @throws GeneralException
	 */
	public function update($id, $input) {
		
			throw new GeneralException('There was a problem updating this asset. Please try again.');
	}

	

	/**
	 * @param $id
	 * @return bool
	 * @throws GeneralException
	 */
	public function destroy($id) {
		if (auth()->id() == $id) {
			throw new GeneralException("You can not delete yourself.");
		}

		$user = $this->findOrThrowException($id);
		if ($user->delete()) {
			return true;
		}

		throw new GeneralException("There was a problem deleting this user. Please try again.");
	}

	/**
	 * @param $id
	 * @return boolean|null
	 * @throws GeneralException
	 */
	public function delete($id,$listingId="null") {
		$asset = $this->findOrThrowException($id, true);
		if($listingId!="null"){
			$asset->Listing()->detach($listingId);
		}
		//print_r($asset);die;
		try {
			$asset->forceDelete();
		} catch (\Exception $e) {
			throw new GeneralException($e->getMessage());
		}
	}

	/**
	 * @param $id
	 * @return bool
	 * @throws GeneralException
	 */
	public function restore($id) {
		$user = $this->findOrThrowException($id);

		if ($user->restore()) {
			return true;
		}

		throw new GeneralException("There was a problem restoring this user. Please try again.");
	}

	/**
	 * @param $id
	 * @param $status
	 * @return bool
	 * @throws GeneralException
	 */
	public function mark($id, $status) {
		if (auth()->id() == $id && ($status == 0 || $status == 2)) {
			throw new GeneralException("You can not do that to yourself.");
		}

		$user = $this->findOrThrowException($id);
		$user->status = $status;

		if ($user->save()) {
			return true;
		}

		throw new GeneralException("There was a problem updating this user. Please try again.");
	}
	
	
	/**
	 * @param $id
	 * @return bool
	 * @throws GeneralException
	 */
	public function getUserGallery($userid,$per_page) {
		$q = Assets::query()
				->with('listing')
				->with('listing.user.profilepic')
                ;

		if($userid > 0){
            $q->OfListing($userid);
        }
        else{
            $q->whereHas('Listing', function ($q) {
                $q->where('listing.status', '!=', 0);
            });
        }

		return $q->paginate($per_page);
	}

	public function getUserGalleryAll($per_page){

        $user_meta=\DB::table('user_meta')->where(array('key'=>'usergallery'))->paginate($per_page);
     
//        print_r($user_meta);       
        $images_info= array();
        $categories = array();

        $logged_in_user_id = 0;

        if(!empty($user_meta)){
//            if(Auth::check()){
//                $logged_in_user_id = Auth::User()->id;
//            }

            foreach ($user_meta as $meta){
                $user_id = $meta->user_id;
                
                $user_business = DB::table('user_business')->where(array('user_id'=> $user_id))->get()->first();
 
                if(empty($user_business)){
                    continue;
                }

//                $user_business = current($user_business);

                $assets_ids = unserialize($meta->value);
      
        
                foreach($assets_ids as $cat_id => $catimages){
                    $cate_id = $cat_id;
                    $cate_info	= \DB::table('categories')->where(array('id'=>$cate_id))->get();
           
                    if(!array_key_exists($cate_id, $categories)){
                        $categories[$cate_id] = $cate_info[0];
                    }

                    foreach($catimages as $imgid=>$imagtitle){
                        $image_id = $imgid;
                        $image_title =$imagtitle['title'];
                        if(!empty($image_id)){
                            $assets	= \DB::table('assets')->where(array('id'=>$image_id))->get();

                            $gallery_likes	= \DB::table('gallery_likes')->where(array('asset_id'=>$image_id))->get();
                            //print_r($assets);

                            foreach($assets as $asset){

//                                if(count($images_info) > 40){
//                                    break;
//                                }

                                $images_info[]=array(
                                    'id'=> $user_id.'_'.$cat_id.'_'.$image_id,
                                    'asset_id'	  =>	$asset->id,
                                    'image_name'  =>	'thumb_medium_'.$asset->name,
                                    'image_org'  =>	    $asset->name,
                                    'image_path'  =>	$asset->path,
                                    'image_title' =>	$image_title,
                                    'image_cat'	  =>	$cate_info[0]->name,
                                    'cat_id'	  =>	$cate_id,
                                    'user_id' => $user_id,
                                    'likes_count' => count($gallery_likes),
                                    'business' => array(
                                         'id' => (isset($user_business->id))?$user_business->id:'',
                                        'business_name' => (isset($user_business->business_name))?$user_business->business_name:'' 
                                    )

                                );

                            }
                        }


                    }
                }

//                $user_meta->data->images = $images_info;
            }

        }

        $itemsTransformed = $user_meta
            ->getCollection()->toArray()
            ;

        // if(!empty($images_info)){
        //     $itemsTransformed[0]->images = empty($images_info) ? new \stdClass(): $images_info;
        // }
//        print_r($images_info);
//        exit;
        if(!empty($images_info)){
            $itemsTransformed[0]->images = empty($images_info) ? new \stdClass(): $images_info;					
        }

        $itemsTransformedAndPaginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $itemsTransformed,
            $user_meta->total(),
            $user_meta->perPage(9),
            $user_meta->currentPage(), [
                'path' => \Request::url(),
                'query' => [
                    'page' => $user_meta->currentPage()
                ]
            ]
        );
        return $itemsTransformedAndPaginated;
    }
}
