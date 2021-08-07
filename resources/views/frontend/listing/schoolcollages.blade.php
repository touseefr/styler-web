@extends('frontend.layouts.account') @section('content')
<section class="container">
    <div class="row">
        <div class="col-md-12 col-xs-12">
            <div class="beauty_collection">
                <h1><img src="images/collection_title.png" alt="Beauty Collection" /></h1>
                <div class="row">
                    <div class="col-md-7 col-sm-12 col-xs-12">
                        <div widget-search id="ex2" placeholder="Search Listing" ishome=false pause="300" selectedobject="" datafield="results" titlefield="title" descriptionfield="title"></div>
                    </div>
                </div>
            </div>
            <!--Beauty_collection-->
        </div>
    </div>
    <div class="row">
        <div class="listing-top-nav">
            <div class="col-md-12">
                @if($records->previousPageUrl())
                <a href="{{$records->previousPageUrl()}}" class="pre_cls">previous school or collage </a> @else
                <span class="pre_cls disabled">previous school or college </span> @endif @if($records->nextPageUrl())
                <a href="{{$records->nextPageUrl()}}" class="next_cls">next school or college</a> @else
                <span class="next_cls disabled">next school or collage </span> @endif
            </div>
        </div>
    </div>
</section>
<!--container-->
<div class="clear"></div>
@if(count($records) > 0)
@foreach ($records as $index =>$item)
<section class="bg_gray border_top">
    <div class="container shadow_del">
        <div class="row classified_contact">
            <div class="col-md-4 col-sm-8 col-xs-8 col-md-offset-1 col-xs-offset-2">
                <div class="row">
                    <div class="col-md-12  text-center">
                        <div class="cls_pic">
                            @if($item->assets && count($item->assets))
								@if(File::exists(public_path().$item->assets[0]['path'].$item->assets[0]['name']))
									<img src="{{$item->assets[0]['path']}}{{$item->assets[0]['name']}}" alt="" class="center-block img-circle img-center" width="200" height="200" /> 
							     @else
									<img src="images/no-image.png" alt="" class="center-block img-circle img-center" width="200" height="200" /> 
								 @endif
							@endif 
                        </div>
                    </div>
                </div>
                <div class="row">
                    @if(isset($item->assets) && count($item->assets)>0)
                    <div class="col-md-12">
                        <span class="border_top photo_title padd_top_btm">Photos:</span>
                        <ul class="class_pic">
                           @foreach($item->assets as $asset)
                            <li>
                                <div class="thumbContainer">
                                    <div class="thumb" style="background-image:url({{$asset->path}}{{$asset->name}})">
                                    </div>
                                </div>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                    @endif
                </div>
            </div>
            <div class="col-md-6 col-sm-12">
                <div class="right_list text-right">
                    <h4 class="title_h4">{{ $item->title}}</h4>
                   <span>
                   {{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans() }}
                   </span> 
                    <span>
                    @if($item->locations && count($item->locations) > 0)
                    {{$item->locations[0]->name}}, {{$item->locations[0]->state}}, {{$item->locations[0]->postcode}}
                    @endif
                    </span>
                   @if(isset($item->address))
                    <span>{{ $item->address}},{{ $item->town}}</span> @endif
                    <span><a href="http://{{ $item->website }}" target="_blank">{{ $item->website }}</a></span>
                    <ul class="social_links">
                        <li>
                            <a href="#" socialshare socialshare-provider="facebook" socialshare-text="{{ $item->title}}" socialshare-description="{{ substr($item->description,0,200).'...' }}" socialshare-via="229619774120606"  socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" socialshare-type="feed" @if(isset($item->assets[0]))
                                socialshare-media="{{ url('/').'/'.$item->assets[0]->path}}{{$item->assets[0]->name}}" @endif class="facebook" >
                                </a>
                        </li>
                        <li>
                            <a href="#" socialshare socialshare-provider="twitter" socialshare-text="{{ $item->title}}" socialshare-hashtags="{{ $item->title}}" socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="twitter">
                            </a>
                        </li>
                        <li>
                            <a href="#" socialshare socialshare-provider="linkedin" socialshare-text="{{ $item->title}}" socialshare-description="{{ $item->title }}" socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="in_icon">
                            </a>
                        </li>
                        <li>
                            <a href="#" class="wifi"></a>
                        </li>
                        <li>
                            <a href="#" socialshare socialshare-provider="pinterest" socialshare-text="{{ $item->title }}" @if(isset($item->assets[0]))
                                socialshare-media="{{ url('/').'/'.$item->assets[0]->path}}{{$item->assets[0]->name}}"
                                @endif
                                socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="globe">
                                </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
<!--bg_gray-->
@endforeach
@else
<span class="not_found">No School or Collage Found.</span>
@endif
<div class="clear"></div>
<!--bg_gray-->
<div class="clear"></div>
<div class="populer_search">
    <div class="rev_title">
        <section class="container">
            <h1>Popular Searches</h1>
        </section>
    </div>
    <div class="populer_inner">
        <section class="container">
            <ul class="pop_srch">
                <li>
                    <i><img src="images/deal_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
                <li>
                    <i><img src="images/blub_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
                <li>
                    <i><img src="images/edu_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
                <li>
                    <i><img src="images/gal_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
                <li>
                    <i><img src="images/sciss_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
                <li>
                    <i><img src="images/jobs_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
                <li>
                    <i><img src="images/news_ico.png" alt=""/></i>
                    <p>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                        <a href="#">Sample seacrh content</a>
                    </p>
                </li>
            </ul>
            <!--pop_srch-->
        </section>
    </div>
</div>
<!--populer_search-->
@endsection('content')
