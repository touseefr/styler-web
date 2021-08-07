<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Categories\Categories;
use App\Models\Blog\Blog;

class BlogController extends Controller {

    public function index() {
        $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
        $posts = Blog::IsPublished('published')->orderBy('id', 'desc')->take(10)->get();

        return view('vendor.blog.index')
                        ->withPosts($posts)
                        ->withCategories($categories)
                        ->withPageTitle('');
    }

    public function Blog($slug) {

        if ($slug) {
            $posts = Blog::IsPublished('published')->orderBy('id', 'desc')->take(10)->get();
            $post = Blog::whereSlug($slug)->first();
            $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
            if ($post) {
                return view('vendor.blog.post.show')
                                ->withPost($post)
                                ->withPosts($posts)
                                ->withCategories($categories)
                                ->withPageTitle($post->title . ' - Magazine');
            } else {
                return redirect('blog');
            }
        } else {
            return redirect('blog');
        }
    }

    public function showCategoryPosts($cat_id) {
        if ($cat_id) {
            $categories = Categories::OfType(env('ADMINBLOGTYPE'))->get();
            $category = Categories::OfType(env('ADMINBLOGTYPE'))->where('id', $cat_id)->first();
            $posts = Blog::IsPublished('published')->where('category_id', $category->id)->take(10)->get();
            if ($category) {
                return view('vendor.blog.category.show')
                                ->withPageTitle($category->name)
                                ->withPosts($posts)
                                ->withCategory($category)
                                ->withCategories($categories)
                                ->withActiveCategory($category->id);
            } else {
                return redirect('blog');
            }
        } else {
            return redirect('blog');
        }
    }

}
