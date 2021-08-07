@extends('frontend.layouts.account')
@section('content')
<div id="fullimagecenter" class="titlebar" style="background-image: url( https://didcode.com/wp-content/themes/dcagency/img/breadcrumb-bg.jpg );">
    <div id="fullimagecentertitle">
        <div class="container">
            <div class="col-md-12">
                <h3 class="mb-20 text-white">Blog</h3>
            </div> </div>
    </div>
</div>
<div class="main">
    <div class="container">            
        <div class="row margin-bottom-40 blog-page">
            <div class="col-md-8 col-sm-8">
               @if(isset($posts) && count($posts)>0)
                    @each('vendor.blog.post.listView', $posts, 'post')  
                @else
                <span> Posts Not Found.</span>
                @endif            
            </div>
            @include('vendor.blog.sidebar')
        </div>
    </div>
</div>

@endsection