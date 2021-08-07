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
                    <article>
                    <div class="content-page">

                        @if ($post->image != '')
                        <p><img style="width:100%" src="{{ url('assets/posts/'.$post->image) }}" alt="" class="img-responsive"></p>
                        @endif
                        <div class="entry-wrap">
                            <div class="post-time">
                                <span class="month"><?php echo date('M', strtotime($post->published_at)); ?></span>
                                <span class="day"><?php echo date('d', strtotime($post->published_at)); ?></span>
                            </div>

                            <div class="entry-title">
                                <h4><a href="" title="Permalink to Et ta soeur, elle est artificielle ?" rel="bookmark">{{ $post->title }}</a></h4>
                            </div>
                            <div class="entry-meta">
                                <ul>
                                    <li class="meta-date"><?php echo date('d F Y', strtotime($post->published_at)); ?></li>
                                    <li class="meta-author"><a href="" original-title="View all posts by didier">Admin</a></li>
                                    <li class="meta-comment"><a href="#respond" class="comments-link" original-title="">No Comments</a></li>
                                    <li class="meta-category"><a href="" rel="category tag" original-title="">Humeurs</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="post_header entry-content">
                            {!! $post->chapo !!}
                        </div>

                        <div class="post_content">
                            {!! $post->content !!}
                        </div>
                        <div class="sharebox clearfix">
<!--                        <div class="shareicons_icon clearfix mt-15">
                          <h4 class="pull-left mr-10 mt-0 font-bold">Share the story:</h4>
                          <ul class="pull-left">  
                            <li>
                                <a href="http://www.facebook.com/sharer.php?u=&t=Et ta soeur, elle est artificielle ?" class="share-facebook h4 px-10" original-title=""><i class="fa fa-facebook fb"></i></a>
                            </li>       
                            <li>
                                <a href="http://twitter.com/home?status=Et ta soeur, elle est artificielle ? " class="share-twitter h4 px-10" original-title=""><i class="fa fa-twitter tw"></i></a>
                            </li>       
                            <li>
                                <a href="http://www.reddit.com/submit?url=&title=Et+ta+soeur%2C+elle+est+artificielle+%3F" class="share-tumblr h4 px-10" original-title=""><i class="fa fa-tumblr tumblr"></i></a>
                            </li>       
                            <li>
                                <a href="http://pinterest.com/pin/create/button/?url=&media=https://didcode.com/wp-content/uploads/2016/10/musk-mars.jpg&" class="share-pinterest pin h4 px-10" original-title=""><i class="fa fa-pinterest"></i></a>
                            </li>       
                            <li>
                                <a href="https://plus.google.com/share?url=" class="share-google gplus h4 px-10" original-title=""><i class="fa fa-google-plus"></i> </a>
                            </li>                                        
                            <li>
                                <a href="http://linkedin.com/shareArticle?mini=true&url=&title=Et ta soeur, elle est artificielle ?" class="share-linkedin h4 px-10" original-title=""><i class="fa fa-linkedin link"></i></a>
                            </li>                                        
                            <li>
                                <a href="mailto:?subject=Et ta soeur, elle est artificielle ?&;body=" class="share-mail h4 px-10" original-title=""><i class="fa fa-envelope-o envelop"></i></a>
                            </li>
                          </ul>
                    </div>-->
                  </div>
                </article>
              </div>



                @include('vendor.blog.sidebar')

            </div>

        </div>
    </div>

@endsection