@extends('frontend.layouts.account') @section('content')
<section class="container">
    @include('frontend.includes.sub_header')
</section>
<section class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="listing-top-nav">
                @if($records->previousPageUrl())
                <a href="{{$records->previousPageUrl()}}" class="pre_cls"><< previous deal</a> @else
                <span class="pre_cls disabled"><< previous deal</span> @endif @if($records->nextPageUrl())
                <a href="{{$records->nextPageUrl()}}" class="next_cls">next deal >></a> @else
                <span class="next_cls disabled">next deal >></span> @endif
            </div>
        </div>
    </div>
</section>
<!--container-->
<div class="clear"></div>
 @foreach ($records as $index =>$item)

<section class="bg_gray border_top">
	<div class="container shadow_del">

		<div class="row listing">
			<div class="col-md-4 col-sm-6 col-xs-8 col-md-offset-4 col-sm-offset-3 col-xs-offset-2">
				<table class="table table-responsive table_view text-center">
					<tr>
						<th>Gallery View:</th>
						<!--<th>Created:</th>-->
						<th>Watchlist:</th>
					</tr>
					<tr>
						<td>{{count($item->listingViews)}}</td>
						<!--<td>{{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans()}}</td>-->
						<td>+{{count($item->listingWatch)}}</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="row classified_contact no_margin_top">
         <div class="col-md-1"></div>

		<div class="col-md-4 col-sm-6">
				<div class="row">
					<div class="col-md-12  text-center">
						<div class="cls_pic">
							@if($item->assets && count($item->assets))
								@if(File::exists(public_path().$item->assets[0]['path'].$item->assets[0]['name']))
									<img src="{{$item->assets[0]['path']}}{{$item->assets[0]['name']}}" alt="" class="center-block img-circle img-center" width="200" height="200" /> 
							     @else
									<img src="images/no-image.png" alt="" class="center-block img-circle img-center" width="200" height="200" /> 
								 @endif
							@else
								<img src="images/no-image.png" alt="" class="center-block img-circle img-center" width="200" height="200" /> 	 
							@endif
							@if(Auth::check())
                            <addto-watch id="{{$item->id}}" ></addto-watch>
                            @endif
						</div>
					</div>
				</div>

				<div class="row">
					@if(count($item->assets))
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
					<div class="col-md-12 contact_provid">
						<label class="padd_top_btm contact">Contact</label>
						<a href="profile?id={{$item->user->id}}" class="padd_top_btm service">{{$item->user->name}}</a>
					</div>

  <div class="col-md-12">
                    <span class="border_top photo_title padd_top_btm">Payment Accepted:</span>
                    <ul class="class_pic payment_accepted cp">
                        <li>
                            <img src="../images/paypal_icon.jpg" alt="" class="img-responsive" />
                        </li>
                        <li>
                            <img src="../images/payment_method.jpg" alt="" class="img-responsive" />
                        </li>
                        <li>
                            <img src="../images/payment_sec.jpg" alt="" class="img-responsive" />
                        </li>
                    </ul>
                </div>
                <div class="col-md-12 contact_provid">
                    @if($item->user->userBusiness && $item->user->id!=Auth::id())
                    <span class="border_top photo_title padd_top_btm">Contact Details:</span>
                    
                    <ul class="class_pic pay_icon payment_accepted">
                        <li>
                            <span widget-booking id="ex4" userto="{{$item->user->id}}" userfrom="{{ Auth::id() }}" categories="{{ $item->user->userBusiness->business_categories }}" /></span>
                        </li>

                        <li><a href="mailto: {{$item->user->email}}"><i class="fa fa-envelope fa-5x fa-yellow" aria-hidden="true"></i></a></li>

                        <li>
                            
                            <a href="tel:+{{$item->user->contact_number}}"><i class="fa fa-phone fa-5x fa-sky" aria-hidden="true"></i></a>
                        </li>
                    </ul>
                    @endif
                </div>



				</div>
			</div>

			<div class="col-md-6 col-sm-6">
				<div class="right_list text-right">
					<h4 class="title_h4">{{ $item->title}}</h4>
					<span>{{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans() }}</span>
					@if(isset($item->locations[0]))
					<span> @if(isset($item->locations[0])) {{ $item->locations[0]->name}},{{ $item->locations[0]->state}} @endif</span>
					@endif
					<span class="price">${{ $item->price }}</span>
					<ul class="social_links">
							<li>
                                <a href="#"
                                socialshare
                                socialshare-provider="facebook"
                                socialshare-text="{{ $item->title}}"
								socialshare-via="229619774120606"
                                socialshare-description="{{ substr($item->description,0,100).'...' }}"
                                socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}"
                                socialshare-type="feed"
                                @if(isset($item->assets[0]))
                                socialshare-media="{{ url('/').$item->assets[0]->path}}{{$item->assets[0]->name}}" @endif class="facebook" >
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                socialshare
                                socialshare-provider="twitter"
                                socialshare-text="{{ $item->title}}"
                                socialshare-hashtags="{{ $item->title}}"
                                socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="twitter">
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                socialshare
                                socialshare-provider="linkedin"
                                socialshare-text="{{ $item->title}}"
                                socialshare-description="{{ substr($item->description,0,200).'...' }}"
                                socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="in_icon">
                                </a>
                            </li>
                            <li><a href="#"class="wifi"></a></li>
                            <li>
                                <a href="#"
                                socialshare
                                socialshare-provider="pinterest"
                                socialshare-text="{{ $item->title}}"
                                @if(isset($item->assets[0]))
                                socialshare-media="{{ url('/').$item->assets[0]->path}}{{$item->assets[0]->name}}"
                                @endif
                                socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="globe">
                                </a>
                        </li>
                    </ul>
				<p>{{ $item->description}}</p>
				</div>
			</div>
		</div>
	</div>
</section><!--bg_gray-->

<div class="clear"></div>
<section class="container.">
		<div class="row">
			<div class="col-md-12 padd0">
				<div class="map border-top map-with-opening-hours">
				@if(isset($item->locations[0]))
        		<location-map location-info="{{$item->locations[0]}}"></location-map>
                @endif
				</div>
			</div>
		</div><!--map-->
</section>
<!--bg_gray-->
<div class="clear"></div>

			<div class="home_review">

				<div class="rev_title">
					<section class="container">
						<h1>Reviews</h1>
					</section>
				</div>

				<section class="container">
					<div class="latest_review">
						<div class="row">
						 @foreach($item->user->ReviewTo as $index => $reviews)
							<div class="col-md-4 col-sm-12 user_latest_reviews" @if($index > 2) style="display:none;" @endif>
								<div class="row">
									<div class="col-md-3 col-sm-3 col-xs-12 text-sm-center">
										@if($reviews->UserFrom->profilepic)
									<figure>
										<a href="{{ URL::to('/') }}/{{ 'profile?id='.$reviews->UserFrom->id}}">
											@if(File::exists(public_path().$reviews->UserFrom->profilepic['path'].'thumb_small_'.$reviews->UserFrom->profilepic['name']))
												<img src="{{$reviews->UserFrom->profilepic['path'].'thumb_small_'.$reviews->UserFrom->profilepic['name']}}" alt="" width="118" height="117" class="img-circle center-block img-responsive" />
											@else
												<img src="images/user_pic.jpg" alt="" class="img-responsive img-circle center-block" />
											@endif
										</a>
									</figure>
									@else
									<figure>
										<a href="{{ URL::to('/') }}/{{ 'profile?id='.$reviews->UserFrom->id}}">
											<img src="images/user_pic.jpg" alt="" class="img-responsive img-circle center-block" />
										</a>
									</figure>
										@endif
										<div class="review_post text-md-center rvwpost">
											<h2><a href="{{ URL::to('/') }}/{{ 'profile?id='.$reviews->UserFrom->id}}">
											{{ $reviews->UserFrom->name }}
											</a></h2>
											<span>{{ count($reviews->UserFrom->ReviewTo) }} Reviews</span>
											<span>{{ $reviews->UserFrom->roles[0]->name }}</span>
										</div>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<span>{{date('M d Y',strtotime($reviews->created_at))}}</span>
										<span class="review_rating" ng-init="rate{{$index}} = {{ $reviews->rating }}">
											<uib-rating ng-model="rate{{$index}}" max="5" readonly="true"  titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating"></uib-rating>
										</span>
										<p>
										@if(strlen($reviews->review_comment) >350)
											{{  substr($reviews->review_comment,0,350).'...' }}
										@else
											{{ $reviews->review_comment }}
										@endif
										</p>
									</div>
								</div>
							</div>
						@endforeach
						@if(count($item->user->ReviewTo) > 2)
						<div class="rev_more"> <a id="load_more" href="#" class="">More</a></div>
						@endif
						</div>
					</div><!--latest_rev-->
				</section>
			</div><!--home_review-->
@endforeach
@if(!count($records))
<div style="text-align: center;padding: 30px;font-size: 18px;font-weight: bold;">No Record Found</div>
@endif			
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
