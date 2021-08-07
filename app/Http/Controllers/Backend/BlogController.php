<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Categories\Categories;
use App\Models\Blog\Blog;

class BlogController extends Controller {

    public function index() {
        $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
        $posts = Blog::all();
        return view('vendor.blog.admin.index')
                        ->withPosts($posts)
                        ->withCategories($categories);
    }

    public function BlogCategories() {
        $categories = array();
        $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
        return view('vendor.blog.admin.category')->withCategories($categories);
    }

    public function createCategory(Request $request) {
        $return = array('status' => "210", "msg" => "Some thing went wrong.Please try again later.");
        if ($request->has('category_name')) {
            try {
                $save_cat = $request->input('category_name');
                $objcate = new Categories();
                $objcate->name = $save_cat;
                $objcate->type_code = env('ADMINBLOGTYPE');
                $objcate->user_id = Auth()->user()->id;
                if ($objcate->save()) {
                    $data = array();
                    $data = array_merge($objcate->toArray(), array("post_count" => $objcate->categoriespostcount()));
                    $return = array('status' => "200", "msg" => "Successfully create.", "data" => $data);
                }
            } catch (Exception $e) {
                $return = array('status' => "210", "msg" => $e->getMessage());
            }
            return $return;
        }
    }

    public function deleteCategory(Request $request) {
        $return = array('status' => "210", "msg" => "Some thing went wrong.Please try again later.");
        if ($request->has('category_id')) {
            try {
                $cat_id = $request->input('category_id');
                $obj_cate = Categories::find($cat_id);
                if ($obj_cate->delete()) {
                    $return = array('status' => "200", "msg" => "Successfully Delete.");
                }
            } catch (Exception $e) {
                $return = array('status' => "210", "msg" => $e->getMessage());
            }
            return $return;
        }
    }

    public function getAddPost() {
        $categories = array();
        $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
        return view('vendor.blog.admin.editor')
                        ->withCategories($categories)
                        ->withPostId('');
    }

    public function postAddPost(Request $request) {
        $return = array('status' => "210", "msg" => "Some thing went wrong.Please try again later.");
        if ($request->all()) {
            $obj_blog = new Blog();
            $obj_blog->title = $request->input('title');
            $obj_blog->slug = $request->input('slug');
            $obj_blog->chapo = $request->input('chapo');
            $obj_blog->content = $request->input('content');
            $obj_blog->category_id = $request->input('cat_id');
            $obj_blog->published_at = date('Y-m-d h:i:s');
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $file_original_name = date('ymdhis') . '_' . $file->getClientOriginalName();
                $destinationPath = 'assets/posts';
                $file->move($destinationPath, $file_original_name);
                $obj_blog->image = $file_original_name;
            }
            if ($obj_blog->save()) {
                $return = array('status' => "200", "msg" => "Successfully create.");
            }
        }
        return redirect('admin/blog');
    }

    public function getEditPost(Request $request, $post_id) {
        if ($post_id) {
            $categories = array();
            $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
            $post = Blog::find($post_id);
            return view('vendor.blog.admin.editor')
                            ->withCategories($categories)
                            ->withPost($post)
                            ->withPostid($post_id);
        } else {
            return redirect()->back();
        }
    }

    public function postEditPost(Request $request) {
        $return = array('status' => "210", "msg" => "Some thing went wrong.Please try again later.");
        if ($request->has('post_id')) {
            $obj_blog = Blog::find($request->input('post_id'));
            $obj_blog->title = $request->input('title');
            $obj_blog->slug = $request->input('slug');
            $obj_blog->chapo = $request->input('chapo');
            $obj_blog->content = $request->input('content');
            $obj_blog->category_id = $request->input('cat_id');
            $obj_blog->published_at = date('Y-m-d h:i:s');
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $file_original_name = date('ymdhis') . '_' . $file->getClientOriginalName();
                $destinationPath = 'assets/posts';
                $file->move($destinationPath, $file_original_name);
                $obj_blog->image = $file_original_name;
            }
            if ($obj_blog->update()) {
                $return = array('status' => "200", "msg" => "Successfully create.");
            }
        }
        return redirect('admin/blog');
    }

    public function postDeletePost($Post_id) {
        $return = array('status' => "210", "msg" => "Some thing went wrong.Please try again later.");
        if ($Post_id) {
            try {
                $obj_post = Blog::find($Post_id);
                if ($obj_post->delete()) {
                    $return = array('status' => "200", "msg" => "Successfully Delete.");
                }
            } catch (Exception $e) {
                $return = array('status' => "210", "msg" => $e->getMessage());
            }
            return $return;
        }
    }

    public function postStatusPost($Post_id) {
        $return = array('status' => "210", "msg" => "Some thing went wrong.Please try again later.");
        if ($Post_id) {
            try {
                $obj_post = Blog::find($Post_id);
                if ($obj_post->post_status == 'draft') {
                    $obj_post->post_status = 'published';
                }
                else if ($obj_post->post_status == 'published') {
                    $obj_post->post_status = 'draft';
                }
                if ($obj_post->save()) {
                    $return = array('status' => "200", "msg" => "Successfully"." ".$obj_post->post_status,"now_status"=>$obj_post->post_status);
                }
            } catch (Exception $e) {
                $return = array('status' => "210", "msg" => $e->getMessage());
            }
            return $return;
        }
    }

}
