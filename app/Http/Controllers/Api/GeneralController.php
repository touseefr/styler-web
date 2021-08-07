<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Frontend\Categories\CategoriesContract;
use DB;

class GeneralController extends Controller {

    protected $categories;

    function __construct(CategoriesContract $categories) {
        $this->categories = $categories;
    }

    public function spcategories(Request $request) {
        $service_categories = $this->categories->getcategoriesByType('service', '1');
        return response()->json(array("status" => "200", "categories" => $service_categories->toArray(), "msg" => "Successful"));
    }

    public function galleryall() {        
        $per_page = 3;
        $user_meta = \DB::table('user_meta')->where(array('key' => 'usergallery'))->paginate($per_page);
        $images_info = array();
        $categories = array();
        $logged_in_user_id = 0;
        if (!empty($user_meta) && count($user_meta) > 0) {

            foreach ($user_meta as $meta) {
                $user_id = $meta->user_id;
                
                $user_business = DB::table('user_business')->where(array('user_id' => $user_id))->get();
                
                if (empty($user_business[0])) {
                    continue;
                }

                $user_business = current($user_business);

                $assets_ids = unserialize($meta->value);


                foreach ($assets_ids as $cat_id => $catimages) {
                    $cate_id = $cat_id;
                    $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();

                    if (!array_key_exists($cate_id, $categories)) {
                        $categories[$cate_id] = $cate_info[0];
                    }

                    foreach ($catimages as $imgid => $imagtitle) {
                        $image_id = $imgid;
                        $image_title = $imagtitle['title'];
                        if (!empty($image_id)) {
                            $assets = \DB::table('assets')->where(array('id' => $image_id))->get();

                            $gallery_likes = \DB::table('gallery_likes')->where(array('asset_id' => $image_id))->get();
                            //print_r($assets);
                            
                            foreach ($assets as $asset) {
                                 $url=public_path().$asset->path.$asset->name;
                                if(file_exists($url)){
                                 list($width, $height) = getimagesize($url);
                                }else{
                                    $width='';
                                    $height='';
                                }
                                
                                $images_info[] = array(
                                    'id' => $user_id . '_' . $cat_id . '_' . $image_id,
                                    'asset_id' => $asset->id,
                                    'image_name' => 'thumb_medium_' . $asset->name,
                                    'image_org' => $asset->name,
                                    'image_path' => $asset->path,
                                    'image_title' => $image_title,
                                    'image_cat' => $cate_info[0]->name,
                                    'cat_id' => $cate_id,
                                    'user_id' => $user_id,
                                    'likes_count' => count($gallery_likes),
                                    'image_size'=>array("width"=>$width,"height"=>$height),
                                    'business' => array(
                                        'id' => $user_business[0]->id,
                                        'business_name' => $user_business[0]->business_name,
                                        'sharing_url' => url('profile?id='.base64_encode($user_business[0]->user_id))
                                    )
                                );                               
                            }
                        }
                    }
                }
            }
        }
        return \GuzzleHttp\json_encode(array("status" => "200", "gallery" => $images_info,"currentPage"=>$user_meta->currentPage(),"last_page"=>$user_meta->lastPage()));
    }

}
